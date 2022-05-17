import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "../lib/types/request-body";
import { writeFileSync } from "fs";
import { v4 as uuid } from "uuid";


export const post: RequestHandler = async ({ request }) => {
    const { files } = await request.json() as RequestBody;
    
    const names = Array.from({ length: files.length }).map(_ => uuid());

    for (const [i, file] of files.entries()) {
        const data = file.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(data, "base64");
        writeFileSync(`${names[i]}.png`, buf);

        
    }

    return {}
};
