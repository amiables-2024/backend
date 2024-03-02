import {AuthenticatedController} from "../../types/express.types";
import {projectRepository} from "../../database/database";
import {ArrayContains} from "typeorm"
import {Project} from "../../models/project/project.model";
import {getProjectBaseFilePath} from "../../utils/file.util";
import {extractTextFromPdfBuffer} from "../../utils/pdf.util";
import {extractTodosFromSpec} from "../../utils/ai.util";
import {Todo} from "../../models/todo/todo.model";
import {TodoPriorityEnum, TodoStatusEnum} from "../../types/models.types";

// GET /projects
export const projectsGet: AuthenticatedController = async (request, response) => {
    const allProjects = await projectRepository.find({
        relations: {
            members: true
        }
    });

    const projects = allProjects
        .filter((project) => project.members
            .some((member) => member.id === request.user.id));

    response.status(200).json({
        success: true,
        data: projects
    })
}

// POST /projects
export const projectsCreate: AuthenticatedController = async (request, response) => {
    const {name} = request.body;
    const file = request.file;

    const project: Project = {
        name: name,
        driveFolderPath: undefined,
        members: [request.user],
        messages: [],
        todos: [],
    }

    project.driveFolderPath = getProjectBaseFilePath(project);

    try {
        const savedProject = await projectRepository.save(project);
        projectSpecHandling(savedProject, file);
        return response.status(201).json({
            success: true,
            data: `Successfully created your new project called ${name}`
        });
    } catch (error) {
        return response.status(400).json({
            success: false,
            data: `An error occurred while trying to create your project`
        });
    }

}

const projectSpecHandling = async (project: Project, file: Express.Multer.File) => {
    if (!file)
        return

    if (file.mimetype !== "application/pdf")
        return

    let context;

    try {
        context = await extractTextFromPdfBuffer(file.buffer);
    } catch (error) {
        // TODO Send message
        return
    }

    const todos = await extractTodosFromSpec(context);
    if (todos.length === 0) {
        // TODO Send message
        return
    }


    for (const todo of todos) {
        try {
            const dbTodo = new Todo();
            dbTodo.title = todo.name;
            dbTodo.description = todo.description;
            dbTodo.status = TodoStatusEnum.PENDING;
            dbTodo.priority = TodoPriorityEnum.MEDIUM;
            dbTodo.project = project;
            project.todos.push(dbTodo);
        } catch (error) {

        }
    }

    // TODO Send message.
}