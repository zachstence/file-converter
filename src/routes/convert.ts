import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "$lib/types/request-body";
import { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import im from "imagemagick";

export const post: RequestHandler = async ({ request }) => {
    const { files, convertTo } = await request.json() as RequestBody;

    if (!files || !files.length || !convertTo) {
        return { status: 400 };
    }
    
    const promises: Promise<void>[] = []
    const names: string[] = [];

    for (const file of files) {
        const data = file.replace(/^data:image\/\w+;base64,/, "");
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
