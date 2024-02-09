import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import EnvConfig from "@config/environment.config";
import { UserService } from "../services/user.service";
import ErrorResponse from "@utils/errorResponse.util";

const MISSING_AUTHORIZATION_TOKEN = "Missing authorization token";
const UNAUTHORIZED_USER = "Unauthorized user !";
const WRONG_AUTHORIZATION_TOKEN = "Wrong authorization token";

const userService: UserService = new UserService();

export default async function authMiddleware(req: any, res: Response, next: NextFunction) {
    try {
        let token: string;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new ErrorResponse(MISSING_AUTHORIZATION_TOKEN, 401));
        }

        jwt.verify(token, EnvConfig.JWT_KEY, async function (error: any, decodedToken: any) {
            if (error) {
                return next(new ErrorResponse(UNAUTHORIZED_USER, 401));
            }

            const tokenId = decodedToken.id ? decodedToken.id : null;

            if (!tokenId) {
                return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
            }

            try {
                const user = await userService.findById(tokenId);

                if (user) {
                    req.user = {
                        // _id: user._id,
                        role: user.role,
                    };
                    return next();
                } else {
                    return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
                }
            } catch (error) {
                return next(new ErrorResponse(error.message, 500));
            }
        });
    } catch (error) {
        return next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
    }
}