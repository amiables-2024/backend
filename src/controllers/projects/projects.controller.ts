import {AuthenticatedController} from "../../types/express.types";
import {projectRepository} from "../../database/database";
import {ArrayContains} from "typeorm"
import {Project} from "../../models/project/project.model";
import {getProjectBaseFilePath} from "../../utils/file.util";

// GET /projects
export const projectsGet: AuthenticatedController = async (request, response) => {
    const projects = await projectRepository.findBy({
        members: ArrayContains([request.user])
    })

    response.status(200).json({
        success: true,
        data: projects
    })
}

// POST /projects
export const projectsCreate: AuthenticatedController = async (request, response) => {
    const {name} = request.body;

    const project: Project = {
        name: name,
        driveFolderPath: undefined,
        members: [request.user],
        messages: [],
        todos: [],
    }

    project.driveFolderPath = getProjectBaseFilePath(project);

    response.status(201).json({
        success: true,
        data: `Successfully created your new project called ${name}`
    })
}