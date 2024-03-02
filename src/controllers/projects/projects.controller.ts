import {AuthenticatedController} from "../../types/express.types";
import {projectRepository, todoRepository} from "../../database/database";
import {Project} from "../../models/project/project.model";
import {extractTextFromPdfBuffer} from "../../utils/pdf.util";
import {extractTodosFromSpec} from "../../utils/ai.util";
import {Todo} from "../../models/todo/todo.model";
import {TodoPriorityEnum, TodoStatusEnum} from "../../types/models.types";
import {sendBotMessage} from "../../utils/misc.util";

// GET /projects
export const projectsGet: AuthenticatedController = async (request, response) => {
    const allProjects = await projectRepository.find({
        relations: {
            members: true
        }
    });

    const filteredProjects = allProjects
        .filter((project) => project.members
            .some((member) => member.id === request.user.id));

    const projects = filteredProjects.map((project) => ({
        ...project,
        progression: 50
    }));

    response.status(200).json({
        success: true,
        data: projects
    })
}

// POST /projects
export const projectsCreate: AuthenticatedController = async (request, response) => {
    const {name} = request.body;
    const file = request.file;

    if (!name)
        return response.status(422).json({success: false, data: "Name is a required field"})

    const project = new Project()
    project.name = name;
    project.members = [request.user];

    try {
        const savedProject = await projectRepository.save(project);
        await sendBotMessage(savedProject, "Hi, welcome to your new project. I'm Freckle, your virtual teammate! I'm here to make sure your project goes smoothly.")
        projectSpecHandling(savedProject, file);

        return response.status(201).json({
            success: true,
            data: savedProject.id
        });
    } catch (error) {
        console.error(error);
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

    let context: string;

    try {
        context = await extractTextFromPdfBuffer(file.buffer);
    } catch (error) {
        await sendBotMessage(project, "Mhmm. I'm currently unable to extract any todos from the specs file you uploaded.")
        return
    }

    const todos = await extractTodosFromSpec(context);
    if (todos.length === 0) {
        await sendBotMessage(project, "Mhmm. I'm currently unable to extract any todos from the specs file you uploaded.")
        return
    }

    const rawDbTodos = todos.map((todo) => {
        try {
            const dbTodo = new Todo();
            dbTodo.title = todo.name;
            dbTodo.description = todo.description;
            dbTodo.status = TodoStatusEnum.PENDING;
            dbTodo.priority = TodoPriorityEnum.MEDIUM;
            dbTodo.project = project;
            return dbTodo
        } catch (error) {
            return null;
        }
    });

    const dbTodos = rawDbTodos.filter((todo) => todo != null);

    await todoRepository.save(dbTodos);

    await sendBotMessage(project,
        "I just had a quick look at the project specifications you uploaded and I have created a couple TODO tasks to help the team get started.\n" +
        `- ${dbTodos.map((todo) => todo.title).join("\n- ")}\n\n` +
        "Go have a look at them now and assign some members to get the ball rolling!"
    )
}

// GET /projects/:projectId
export const projectGet: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOne({
        where: {id: projectId}
    });

    if (!project)
        return response.status(404).json({success: false, data: "Invalid project id provided"})

    return response.status(200).json({
        success: true,
        data: project
    })
}