import { readFile } from '$lib/util/readFile'
import type { ConvertRequestBody, ConvertResponseBody } from 'src/routes/convert'
import type { UploadUrlResponseBody } from 'src/routes/upload-url'
import { get, writable, type Readable, type Writable } from 'svelte/store'

interface BaseItem {
  file: File
  status: 'ready' | 'uploading' | 'converting' | 'success' | 'error'
}

interface ReadyItem extends BaseItem {
  file: File
  status: 'ready'
}

interface UploadingItem extends BaseItem {
  file: File
  status: 'uploading'
}

interface ConvertingItem extends BaseItem {
  file: File
  status: 'converting'
}

interface SuccessItem extends BaseItem {
  file: File
  status: 'success'
  downloadUrl: string
}

interface ErrorItem extends BaseItem {
  file: File
  status: 'error'
  error: string
}

export type Item = ReadyItem | UploadingItem | ConvertingItem | SuccessItem | ErrorItem

export interface ItemStore {
  subscribe: Readable<Item>['subscribe']
  convert: () => Promise<void>
}

const convertItem = async (item: Writable<Item>) => {
  const $item = get(item)

  // ======================================
  // Uploading
  // ======================================
  item.set({
    ...$item,
    status: 'uploading',
  })
  // Get upload URL
  const uploadUrlResponse = await fetch('/upload-url')
  if (!uploadUrlResponse.ok) {
    item.set({
      ...$item,
      status: 'error',
      error: 'Uploading failed', // TODO better errors?
    })
  }
  const { id, uploadUrl } = (await uploadUrlResponse.json()) as UploadUrlResponseBody

  // Upload file
  // TODO implement multipart upload for larger files
  const buffer = await readFile($item.file)

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: buffer,
    headers: {
      'Content-Type': $item.file.type,
    },
  })
  if (!uploadResponse.ok) {
    item.set({
      ...$item,
      status: 'error',
      error: 'Uploading failed', // TODO better errors?
    })
  }

  // ======================================
  // Converting
  // ======================================
  const convertBody: ConvertRequestBody = {
    objectName: id,
    convertTo: 'png', // TODO dropdown
  }
  const convertResponse = await fetch('/convert', {
    method: 'POST',
    body: JSON.stringify(convertBody)
  })
  if (!convertResponse.ok) {
    item.set({
      ...$item,
      status: 'error',
      error: 'Converting failed',
    })
  }
  const { downloadUrl } = await convertResponse.json() as ConvertResponseBody

  item.set({
    ...$item,
    status: 'success',
    downloadUrl,
  })
}

export const createItem = (file: File) => {
  const store = writable<Item>({
    file,
    status: 'ready',
  })

  return {
    subscribe: store.subscribe,
    convert: () => convertItem(store),
  }
}
