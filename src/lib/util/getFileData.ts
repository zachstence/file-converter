import { uploads } from "$lib/store/uploads.store";
import { get } from "svelte/store";

export const readUploads = (): void => {
    for (const upload of uploads) {
        const next = get(upload)
        console.log('reading', next.file.name)

        const reader = new FileReader();
        reader.readAsDataURL(next.file);

        reader.onload = e => {
            const s = e.target?.result?.toString();
            if (!s) {
                next.error = "Couldn't read file";
            } else {
                next.data = s;
                next.status = 'ready'
                console.log('read', next.file.name, next.data.length)
            }
        };

        reader.onerror = e => {
            next.error = "Couldn't read file";
        };

        upload.set(next)
    }
}
