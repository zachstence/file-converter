import type { Formats } from '$lib/types/formats'
import { getFormats } from '$lib/util/getFormats'
import type { RequestHandler } from '@sveltejs/kit'

export const get: RequestHandler<never, Formats> = async () => {
  const body = await getFormats()
  return { body }
}
