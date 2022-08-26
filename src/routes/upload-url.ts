import type { RequestHandler } from '@sveltejs/kit'
import { getUploadUrl } from '$lib/minio'
import { v4 as uuid } from 'uuid'

export interface UploadUrlResponseBody {
  id: string
  uploadUrl: string
}

export const get: RequestHandler<never, UploadUrlResponseBody> = async () => {
  const id = uuid()
  const uploadUrl = await getUploadUrl(id)
  return {
    body: { id, uploadUrl },
  }
}
