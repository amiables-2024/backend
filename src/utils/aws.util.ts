import * as AWS from 'aws-sdk';
import * as Buffer from "buffer";
import {ObjectList} from "aws-sdk/clients/s3";

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

const S3_BUCKET: string = process.env.S3_BUCKET!;

export const getFilesInFolder = async (filePath: string): Promise<ObjectList> => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: filePath,
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve(data.Contents)
        })
    })
}

export const uploadFileToS3 = async (filePath: string, fileType: string, fileContents: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: S3_BUCKET,
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
            Bucket: S3_BUCKET,
            Key: path
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve(data.Body)
        })
    })
}

export const deleteFileFromS3 = async (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: S3_BUCKET,
            Key: path
        }, (error, data) => {
            if (error)
                reject(error)
            else
                resolve(data)
        })
    })
}