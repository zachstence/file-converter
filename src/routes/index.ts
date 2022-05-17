import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "../lib/types/request-body";
import { writeFileSync } from "fs";


export const post: RequestHandler = async ({ request }) => {
    const body = await request.json() as RequestBody;

    for (const [i, file] of body.files.entries()) {
        const data = file.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(data, "base64");
        writeFileSync(`image${i}.png`, buf);
    }

    return {}
};
