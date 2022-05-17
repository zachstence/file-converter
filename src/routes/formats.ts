import type { Formats } from "$lib/types/formats";
import type { RequestHandler } from "@sveltejs/kit";
import im from "imagemagick";
import { promisify } from "util";

const identify = promisify(im.identify);
const FORMAT_REGEX = /\s*(\w+)\*? \w+\s+([r-])([w-])([+-])\s+.*/

export const get: RequestHandler<never, Formats> = async () => {
    const body: Formats = {
        from: [],
        to: [],
    };

    const s = await identify(["-list", "format"]);    
    const lines = s.split("\n");

    lines.forEach(l => {
        const match = l.match(FORMAT_REGEX);
        if (match) {
            const [_, format, r, w] = match;
            if (r === "r") body.from.push(format);
            if (w === "w") body.to.push(format);
        }
    })

    return { body }
}