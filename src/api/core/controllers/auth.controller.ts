import AuthService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "@utils/errorResponse.util";
import { forgotPasswordValidator, loginValidator } from "@validations/auth.validation";
import { emailEmitter } from "@events";
import { EVENTS_NAMES } from "@enums";

export default class AuthController {

    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // @desc      Login user
    // @route     POST /api/v1/auth/login
    // @access    Public
    public loginHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const schema = loginValidator.body;
            const { error } = schema.validate(req.body);

            if (error) {
                throw new ErrorResponse(error.message, 400);
            }

            const token = await this.authService.login(req.body);

            res.cookie('token', token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            });

            return res.status(200).json({
                success: true,
                message: "User successfully logged in",
                token: token
            });

        } catch (e) {
            next(e);
        }
    }

    // @desc      Log user out / clear cookie
    // @route     GET /api/v1/auth/logout
    // @access    Private
    public logoutHandler = async (_, res: Response, next: NextFunction) => {
        try {

            res.cookie('token', 'none', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true
            });

            res.status(200).json({
                success: true,
                data: {}
            });

        } catch (e) {
            next(new ErrorResponse(e.message, 500));
        }
    }

    // @desc      Forgot password
    // @route     POST /api/v1/auth/forgot-password
    // @access    Public
    public forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const schema = forgotPasswordValidator.body;
            const { error } = schema.validate(req.body);

            if (error) {
                throw new ErrorResponse(error.message, 400);
            }

            const { user, resetToken } = await this.authService.forgotPassword(req.body);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

            try {

                emailEmitter.emit(EVENTS_NAMES.user_forgot_passwd, user, resetUrl);

                return res.status(200).json({
                    success: true,
                    message: "Mail sent successfully",
                    data: {
                        user: user,
                        resetToken: resetToken
                    }
                });

            } catch (err) {

            }
        } catch (e) {
            next(e);
        }
    }
}

