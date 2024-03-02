// In MB
import {Project} from "../models/project/project.model";
import {deleteFileFromS3, getFilesInFolder, uploadFileToS3} from "./aws.util";
import {ObjectList} from "aws-sdk/clients/s3";

const FILE_SIZE_LIMIT = 20;

/**
 * Determine the S3 bucket base path for a project
 *
 * @param project
 * @returns {string} the base path of a project
 */
export const getProjectBaseFilePath = (project: Project): string => {
    return `projects/${project.id.toString()}/`
}

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
        const filePath: string = `${getProjectBaseFilePath(project)}${file.filename}`
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
        const filePath: string = `${getProjectBaseFilePath(project)}${fileName}`
        try {
            await deleteFileFromS3(filePath);
            resolve(true);
        } catch (error) {
            resolve(false);
        }
    });
}

/**
 * Get all the files for a project
 * @param project
 */
export const getProjectFiles = async (project: Project): Promise<ObjectList> => {
    return new Promise(async (resolve, reject) => {
        const filePath: string = getProjectBaseFilePath(project);
        resolve(getFilesInFolder(filePath));
    });
}