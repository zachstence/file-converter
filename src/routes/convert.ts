import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "$lib/types/request-body";
import { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import im from "imagemagick";
import { getFormats } from "$lib/util/getFormats";

const FORMAT_REGEX = /^data:image\/(\w+);base64,(.*)/;

export const post: RequestHandler = async ({ request }) => {
    const { files, convertTo } = await request.json() as RequestBody;

    if (!files || !files.length || !convertTo) {
        return {
            status: 400,
            body: {
                message: "Please specify files and format to convert to",
            },
        };
    }

    const formats = await getFormats();
    console.log(formats);

    if (!formats.to.includes(convertTo.toUpperCase())) {
        return {
            status: 400,
            body: {
                message: `Converting to ${convertTo} is not supported`,
            },
        };
    }
    
    const promises: Promise<void>[] = []
    const names: string[] = [];

    for (const file of files) {
        const match = file.match(FORMAT_REGEX);
        if (!match) {
            return {
                status: 400,
                body: {
                    message: "Unable to determine format",
                },
            };
        }

        const [_, format, data] = match;
        if (!format) {
            return {
                status: 400,
                body: {
                    message: "Unable to determine format",
                },
            };
        }

        if (!formats.from.includes(format.toUpperCase())) {
            return {
                status: 400,
                body: {
                    message: `Converting from ${format} is not supported`,
                },
            }
        }

        if (!data) {
            return {
                status: 400,
                body: {
                    message: "No data",
                },
            };
        }
        
        const buf = Buffer.from(data, "base64");

        const name = uuid();
        names.push(name);
        writeFileSync(name, buf); // TODO async

        const p = new Promise<void>((resolve, reject) => {
            im.convert([name, `${name}.${convertTo}`], (err, result) => {
                if (err) reject();
                else resolve();
            });
        });
        promises.push(p);
    }

    await Promise.all(promises);

    const convertedFiles: string[] = [];

    for (const name of names) {
        const data = readFileSync(`${name}.${convertTo}`, "base64").toString();
        convertedFiles.push(`data:image/${convertTo};base64,${data}`);
    }

    return {
        body: {
            files: convertedFiles,
        },
    };
};
