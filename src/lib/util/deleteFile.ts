import { unlink } from 'fs'

export const deleteFile = (filepath: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        unlink(filepath, (err) => {
            if (err) reject()
            else resolve()
        })
    })
}