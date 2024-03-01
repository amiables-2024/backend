import * as AWS from 'aws-sdk';
import * as Buffer from "buffer";

const env_vars = [
    'S3_ACCESS_KEY', 'S3_ACCESS_KEY_SECRET', 'S3_BUCKET'
]

for (const env_var of env_vars) {
    if (!process.env[env_var]) {
        throw new Error(`Invalid/Missing environment variable: "${env_var}"`);
    }
}

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET!
})

export const uploadFileToS3 = async (filePath: string, fileType: string, fileContents: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.S3_BUCKET!,
            Key: filePath,
            ContentType: fileType,
            Body: fileContents
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve({url: data.Location})
        })
    })
}

export const retrieveFileFromS3 = async (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: process.env.S3_BUCKET!,
            Key: path
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve(data.Body)
        })
    })
}

export const deleteFileFromS3 = async(path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: process.env.S3_BUCKET!,
            Key: path
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve(data)
        })
    })
}