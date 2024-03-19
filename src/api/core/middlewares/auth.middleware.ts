import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserService } from "../services/hr/user.hr.service";
import EnvConfig from "../../config/environment.config";
import ErrorResponse from "../utils/errorResponse.util";

const MISSING_AUTHORIZATION_TOKEN = "Missing authorization token";
const UNAUTHORIZED_USER = "Unauthorized user!";
const WRONG_AUTHORIZATION_TOKEN = "Wrong authorization token";

const userService: UserService = new UserService();

export default async function authMiddleware(req: any, res: Response, next: NextFunction) {
    try {
        let token: string | undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new ErrorResponse(MISSING_AUTHORIZATION_TOKEN, 401));
        }

        jwt.verify(token, EnvConfig.JWT_KEY, async (error: any, decodedToken: any) => {
            if (error) {
                return next(new ErrorResponse(UNAUTHORIZED_USER, 401));
            }

            const tokenId = decodedToken?.id;

            if (!tokenId) {
                return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
            }

            try {
                const user = await userService.findById(tokenId);

                if (!user) {
                    return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
                }

                req.user = {
                    id: user.id,
                    role: user.role,
                };
                return next();
            } catch (error) {
                return next(new ErrorResponse(error.message, 500));
            }
        });
    } catch (error) {
        return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
    }
}