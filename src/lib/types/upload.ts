export interface Upload {
    name: string;
    data: string;
    status?: "uploading" | "uploaded" | "converting" | "converted" | "failed";
}
