import * as Minio from 'minio';

const inputBucket = 'input'
const outputBucket = 'output'

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
