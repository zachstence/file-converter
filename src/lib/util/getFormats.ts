import type { Formats } from '$lib/types/formats'
import { promisify } from 'util'
import im from 'imagemagick'

const identify = promisify(im.identify)
const FORMAT_REGEX = /\s*(\w+)\*? \w+\s+([r-])([w-])([+-])\s+.*/

export const getFormats = async (): Promise<Formats> => {
  const formats: Formats = {
    from: [],
    to: [],
  }

  const s = await identify(['-list', 'format'])
  const lines = s.split('\n')

  lines.forEach((l) => {
    const match = l.match(FORMAT_REGEX)
    if (match) {
      const [_, format, r, w] = match
      if (r === 'r') formats.from.push(format)
      if (w === 'w') formats.to.push(format)
    }
  })

  return formats
}
