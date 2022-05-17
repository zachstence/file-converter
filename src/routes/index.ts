import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "../lib/types/request-body";
import { writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import im from "imagemagick";

const FROM = "png";
const TO = "jpg";

export const post: RequestHandler = async ({ request }) => {
    const { files } = await request.json() as RequestBody;
    
    const promises: Promise<void>[] = []

    for (const file of files) {
        const data = file.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(data, "base64");

        const name = uuid();
        writeFileSync(`${name}.${FROM}`, buf); // TODO async

        const p = new Promise<void>((resolve, reject) => {
            im.convert([`${name}.${FROM}`, `${name}.${TO}`], (err, result) => {
                if (err) reject();
                else resolve();
            });
        });
        promises.push(p);
    }

    await Promise.all(promises);



    return {}
};
