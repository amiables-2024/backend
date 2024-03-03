import {AuthenticatedController} from "../../../types/express.types";
import {messageRepository, projectRepository} from "../../../database/database";
import {Message} from "../../../models/message/message.model";

// GET /projects/:projectId/messages
export const projectMessagesGet: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOne({
        where: {id: projectId},
        relations: {
            messages: {
                user: true
            }
        },
        order: {
            messages: {
                createdAt: "ASC"
            }
        }
    });

    if (!project)
        return response.status(404).json({success: false, data: "No project with that id exists"})

    return response.status(200).json({
        success: true,
        data: project.messages
    })
}

// POST /projects/:projectId/messages
export const projectMessagesCreate: AuthenticatedController = async (request, response) => {
    const {projectId} = request.params;

    const project = await projectRepository.findOneBy({id: projectId});
    if (!project)
        return response.status(404).json({success: false, data: "No project with that id exists"})

    const {content} = request.body;

    if (!content)
        return response.status(422).json({success: false, data: 'You cannot send an empty message'})

    const message = new Message();
    message.content = content.trim();
    message.user = request.user;
    message.project = project;

    try {
        await messageRepository.save(message);
        return response.status(201).json({
            success: true,
            data: `Successfully sent your message`
        })
    } catch (error) {
        console.error(error);
        return response.status(400).json({
            success: false,
            data: `Unable to send your message`
        })
    }
}