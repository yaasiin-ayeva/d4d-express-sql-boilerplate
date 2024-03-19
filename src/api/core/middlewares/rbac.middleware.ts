import { NextFunction, Response } from "express";
import ErrorResponse from "../utils/errorResponse.util";

export default function rbacMiddleware(allowedRoles: string[]) {
    return (req: any, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return next(new ErrorResponse("User role not found", 401));
        }

        if (!allowedRoles.includes(userRole.type)) {
            return next(new ErrorResponse("Unauthorized access", 403));
        }

        next();
    };
}