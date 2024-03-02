import {TodoStatusEnum} from "../types/models.types";
import {Project} from "../models/project/project.model";
import {getIo} from "../socketio/socketio";
import {messageRepository, userRepository} from "../database/database";
import {Message} from "../models/message/message.model";
import {BroadcastMessageData} from "../types/socketio.types";
import {BOT_USER_ID} from "./constants.util";

/**
 * Checks if an email is valid
 *
 * @param email The email to be checked
 */
export const isValidEmail = (email: string): boolean => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return !!(email !== '' && email.match(emailFormat));
}

function enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
        ? value as unknown as T
        : undefined;
}

export const todoStatusFromString = (status: string): TodoStatusEnum | undefined => {
    return enumFromStringValue<TodoStatusEnum>(TodoStatusEnum, status);
}

/**
 * Send a message as the bot to a project's channel
 * @param project
 * @param content
 */
export const sendBotMessage = async (project: Project, content: string) => {
    const botUser = await userRepository.findOneBy({id: BOT_USER_ID});
    if (!botUser)
        return

    const message = new Message();
    message.content = content;
    message.user = botUser;
    message.project = project;

    const savedMessage = await messageRepository.save(message);
    const io = getIo();

    const broadcastData: BroadcastMessageData = {
        id: savedMessage.id,
        content: savedMessage.content,
        createdAt: new Date(),
        user: {
            id: botUser.id,
            name: botUser.name
        }
    }

    io.to(project.id).emit("receive_msg", broadcastData);
}