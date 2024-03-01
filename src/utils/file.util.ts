// In MB
import {Project} from "../models/project/project.model";
import {deleteFileFromS3, uploadFileToS3} from "./aws.util";

const FILE_SIZE_LIMIT = 20;

/**
 * Save a file from a server request to the AWS
 *
 * @param project The project the file is being uploaded to
 * @param file The file uploaded to the server
 * @returns The internal path of the file
 */
export const saveFile = async (project: Project, file: Express.Multer.File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        // Ensures the file has a value and isn't greater than the limit.
        if (file.size <= 0 || (file.size / (1024 * 1024)) > FILE_SIZE_LIMIT) {
            return reject("File is too big")
        }

        // Create the filepath
        const filePath: string = `projects/${project.id.toString()}/${file.filename}`
        // Upload the file to S3
        const storedFile = await uploadFileToS3(filePath, file.mimetype, file.buffer)

        resolve(storedFile.url);
    });
}


export const addFolder = async (project: Project, folderName: string): Promise<string> => {
    return "";
}

export const deleteFile = async (project: Project, fileName: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        const filePath: string = `projects/${project.id.toString()}/${fileName}`;
        try {
            await deleteFileFromS3(filePath);
            resolve(true);
        } catch (error) {
            resolve(false);
        }
    });
}