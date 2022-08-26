import type { RequestHandler } from "@sveltejs/kit";
import im from "imagemagick";
import { getFormats } from "$lib/util/getFormats";
import { fGetInput } from "../minio";
import { unlink } from 'fs'

export interface ConvertRequestBody {
    objectName: string
    convertTo: string
}

export const post: RequestHandler = async ({ request }) => {
    const { objectName, convertTo } = await request.json() as ConvertRequestBody;

    // Validate convertTo format
    const formats = await getFormats();
    if (!formats.to.includes(convertTo.toUpperCase())) {
        return {
            status: 400,
            body: {
                message: `Converting to ${convertTo} is not supported`,
            },
        };
    }
    
    const filepath = await fGetInput(objectName)

    const result = await new Promise<void>((resolve, reject) => {
        im.convert([filepath, `${filepath}.${convertTo}`], (err, result) => {
            unlink(filepath, (err) => {
                if (err) reject(err)
                else resolve(result)
            });

            if (err) reject(err);
        });
    });

    console.log(result)

    return {}
};
