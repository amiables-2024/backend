import {TodoStatusEnum} from "../types/models.types";

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