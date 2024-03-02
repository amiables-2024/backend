import {AuthenticatedController} from "../../../types/express.types";
import {projectRepository, todoRepository, userRepository} from "../../../database/database";
import {Todo} from "../../../models/todo/todo.model";
import {TodoPriorityEnum, TodoStatusEnum} from "../../../types/models.types";
import {todoStatusFromString} from "../../../utils/misc.util";

// GET /projects/:projectId/todos
export const projectTodosGet: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOne({
        where: {id: projectId},
        relations: {
            todos: true
        }
    });

    if (!project)
        return response.status(404).json({success: false, data: "No project with that id exists"})

    return response.status(200).json({
        success: true,
        data: project.todos
    })
}

// POST /projects/:projectId/todos
export const projectTodosCreate: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOneBy({id: projectId});
    if (!project)
        return response.status(404).json({success: false, data: "No project with that id exists"})

    const {title, description, status} = request.body;

    if (!title)
        return response.status(422).json({success: false, data: 'Missing title field'})
    if (!description)
        return response.status(422).json({success: false, data: 'Missing description field'})

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatusEnum.PENDING;
    if (status) {
        const todoStatus = todoStatusFromString(status);
        if (todoStatus) {
            todo.status = todoStatus;
        }
    }
    todo.priority = TodoPriorityEnum.MEDIUM;
    todo.project = project;

    try {
        await todoRepository.save(todo);
        return response.status(201).json({
            success: true,
            data: `Successfully created your new todo item: ${title}`
        })
    } catch (error) {
        console.error(error);
        return response.status(400).json({
            success: false,
            data: `An error occurred while creating your todo item`
        })
    }
}


// PATCH /projects/:projectId/todos/:todoId
export const projectTodosEdit: AuthenticatedController = async (request, response) => {
    const {todoId} = request.params;

    const todo = await todoRepository.findOneBy({id: todoId});
    if (!todo)
        return response.status(404).json({success: false, data: "No todo with that id exists"});

    const {title, description, assigneeId, status} = request.body;

    if (title)
        todo.title = title;

    if (description)
        todo.description = description;

    if (assigneeId) {
        const assignee = await userRepository.findOneBy({id: assigneeId});
        if (assignee) {
            todo.assignee = assignee;
        }
    }

    if (status) {
        const todoStatus = todoStatusFromString(status);
        if (todoStatus) {
            todo.status = todoStatus;
        }
    }

    try {
        await todoRepository.save(todo);
        return response.status(201).json({
            success: true,
            data: `Successfully updated your todo item`
        })
    } catch (error) {
        return response.status(400).json({
            success: false,
            data: `An error occurred while updating your todo item`
        })
    }


}