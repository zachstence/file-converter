import * as Minio from 'minio';
import type { Readable } from 'stream'

const inputBucket = 'input'
const outputBucket = 'output'

const TMP_DIR = '/home/zach/code/personal/file-converter/tmp'

// TODO extract to config/env
const client = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'G8QrA8tP0CLKTkzU',
    secretKey: '4UMtB2fjCL5MxNRrSgzC0JRmrmKUPa4A',
})

export const getUploadUrl = (objectName: string): Promise<string> => {
    return client.presignedPutObject(inputBucket, objectName)
}

export const fGetInput = async (objectName: string): Promise<string> => {
    const path = `${TMP_DIR}/${objectName}`
    await client.fGetObject(inputBucket, objectName, path)
    return path
}

export const putOutput = async (objectName: string, object: Readable): Promise<void> => {
    await client.putObject(outputBucket, objectName, object)
}
