import type { RequestHandler } from "@sveltejs/kit";
import type { RequestBody } from "$lib/types/request-body";

export const post: RequestHandler = async ({ request }) => {
    const body = await request.json();

    console.log(Object.keys(body));

    return {}
};
