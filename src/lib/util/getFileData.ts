export const getFileData = async (file: File): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise<string>((resolve, reject) => {
        reader.onload = e => {
            const s = e.target?.result?.toString();
            if (!s) reject();
            else resolve(s);
        };

        reader.onerror = e => reject(e);

        // TODO progress
    });
};

export const getFilesData = async (files?: FileList): Promise<string[]> => {
    if (!files || !files.length) return [];
    
    const _files: File[] = [];
    for (let i = 0; i < files.length; i++) {
        _files.push(files[i]);
    }

    return Promise.all(_files.map(getFileData));
};
