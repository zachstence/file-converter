import { getUploadUrl } from '$lib/minio'
import { json } from '@sveltejs/kit'
import { v4 as uuid } from 'uuid'

export interface UploadUrlResponseBody {
  id: string
  uploadUrl: string
}

type RequestHandler = import('./$types').RequestHandler

export const GET: RequestHandler = async () => {
  const id = uuid()
  const uploadUrl = await getUploadUrl(id)

  const body: UploadUrlResponseBody = { id, uploadUrl }
  return json(body)
}
