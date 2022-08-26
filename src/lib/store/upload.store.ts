import { writable } from "svelte/store";

export interface IUpload {
    status: "uploading" | "converting" | "success" | "failed";
    file: File;
    data?: string;
    error?: string;
}

export const upload = writable<IUpload>();
