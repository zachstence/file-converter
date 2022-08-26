import { type Writable, get } from 'svelte/store'

import { readFile } from '$lib/util/readFile'
import type { ConvertRequestBody, ConvertResponseBody } from '../../../routes/convert'
import type { UploadUrlResponseBody } from '../../../routes/upload-url'
import type { Item } from './item.types'

export const convertItem = async (item: Writable<Item>) => {
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
    body: JSON.stringify(convertBody),
  })
  if (!convertResponse.ok) {
    item.set({
      ...$item,
      status: 'error',
      error: 'Converting failed',
    })
  }
  const { downloadUrl } = (await convertResponse.json()) as ConvertResponseBody

  item.set({
    ...$item,
    status: 'success',
    downloadUrl,
  })
}
