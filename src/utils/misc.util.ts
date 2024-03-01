/**
 * Checks if an email is valid
 *
 * @param email The email to be checked
 */
export const isValidEmail = (email: string): boolean => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return !!(email !== '' && email.match(emailFormat));
}