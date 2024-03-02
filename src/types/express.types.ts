import {NextFunction, Request, Response} from "express";
import {User} from "../models/user/user.model";

export type AuthenticatedRequest = Request & { user: User };

export type Controller = (request: Request, response: Response, next?: NextFunction) => Promise<any>;

export type AuthenticatedController = (request: AuthenticatedRequest, response: Response, next?: NextFunction) => Promise<any>
