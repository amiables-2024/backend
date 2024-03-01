import {NextFunction, Request, Response} from "express";
import {userRepository} from "../database/database";
import {decodePayloadFromJWT} from "../utils/jwt.util";
import {AuthenticatedRequest} from "../types/express.types";

/**
 * Authorization middleware that checks the Bearer header and attaches the associated user
 * to the request payload
 *
 * @param request
 * @param response
 * @param next
 */
export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const unauthenticated = () => {
        response.status(401).json({success: false, data: "Unauthorized"})
    }

    const header = request.headers.authorization
    if (!header) {
        return unauthenticated();
    }
    const token = header.replace("Bearer ", "");
    const payload = decodePayloadFromJWT(token);
    if (!payload)
        return unauthenticated();

    const id = payload['id'];
    if (!id)
        return unauthenticated();

    const user = await userRepository.findOne({
        where: {id: id}
    });

    if (!user)
        return unauthenticated();

    (request as AuthenticatedRequest).user = user;
    next();
}