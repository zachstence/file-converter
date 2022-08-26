import type { RequestHandler } from "@sveltejs/kit";
import { getUploadUrl } from "../minio";
import { v4 as uuid } from 'uuid';

export interface UploadUrlResponse {
    id: string
    uploadUrl: string
}

export const get: RequestHandler<never, UploadUrlResponse> = async () => {
    const id = uuid()
    const uploadUrl = await getUploadUrl(id)
    return {
        body: { id, uploadUrl }
    }
}
