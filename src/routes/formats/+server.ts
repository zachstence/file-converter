import type { Formats } from '$lib/types/formats'
import { getFormats } from '$lib/util/getFormats'
import { json } from '@sveltejs/kit'

export type FormatsResponseBody = Formats

type RequestHandler = import('./$types').RequestHandler

export const GET: RequestHandler = async () => {
  const body: FormatsResponseBody = await getFormats()
  return json(body)
}
