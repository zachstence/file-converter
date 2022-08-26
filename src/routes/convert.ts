import type { RequestHandler } from "@sveltejs/kit";
import im from "imagemagick";
import { getFormats } from "$lib/util/getFormats";
import { fGetInput, fPutOutput, getDownloadUrl } from "$lib/minio";
import { deleteFile } from "$lib/util/deleteFile";

export interface ConvertRequestBody {
    objectName: string
    convertTo: string
}

export interface ConvertResponseBody {
    downloadUrl: string
}

export const post: RequestHandler<never, ConvertResponseBody> = async ({ request }) => {
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
    const outputFilepath = `${filepath}.${convertTo}`
    await new Promise<void>((resolve, reject) => {
        im.convert([filepath, outputFilepath], (err, result) => {
            if (err) reject(err);
            else resolve(result)
        });
    });

    // Upload result to Minio
    await fPutOutput(objectName, outputFilepath)
    const downloadUrl = await getDownloadUrl(objectName)

    // Delete local files
    await Promise.all([
        deleteFile(filepath),
        deleteFile(outputFilepath),
    ])

    return { body: { downloadUrl } }
};
