import {AuthenticatedController} from "../../../types/express.types";
import {getProjectFiles, saveFile} from "../../../utils/file.util";
import {projectRepository} from "../../../database/database";

// GET /projects/:projectId/files
export const projectFilesGet: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOne({
        where: {id: projectId}
    });

    if (!project)
        return response.status(404).json({success: false, data: "Invalid project id provided"})

    try {
        const files = getProjectFiles(project);
        response.status(200).json({
            success: true,
            data: files
        })
    } catch (error) {
        response.status(400).json({
            success: false,
            data: "Unable to retrieve files. Please try again later."
        })
    }
}

// POST /projects/:projectId/files
export const projectFilesUpload: AuthenticatedController = async (request, response) => {
    const files = request.files as Express.Multer.File[];
    if (files.length === 0)
        return response.status(422).json({success: false, data: "You must allowed at least one file"});

    const {projectId} = request.params;

    const project = await projectRepository.findOne({
        where: {id: projectId}
    });

    if (!project)
        return response.status(404).json({success: false, data: "Invalid project id provided"})

    const failedUploads = []
    for (const file of files) {
        try {
            await saveFile(project, file);
        } catch (error) {
            failedUploads.push(file.filename);
        }
    }

    if (failedUploads.length === 0)
        return response.status(201).json({
            success: true,
            data: `Successfully uploaded ${files.length} files`
        })

    return response.status(201).json({
        success: true,
        data: `Uploaded ${files.length - failedUploads.length} files, but unable to upload the following files: ${failedUploads.join(", ")}`
    });
}