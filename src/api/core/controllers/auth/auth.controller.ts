import logger from "../../../config/logger.config";
import AuthService from "../../services/auth/auth.service";
import { NextFunction, Request, Response } from "express";
import { EVENTS_NAMES } from "../../types/enums";
import { emailEmitter } from "../../types/events";
import { parse_joi_error } from "../../utils/error-validator-parser.util";
import ErrorResponse from "../../utils/errorResponse.util";
import { signupSchema, signinSchema, forgotPasswordSchema } from "../../validations/schemas/auth/auth.schema";

export default class AuthController {

    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // @desc      Register user
    // @route     POST /api/v1/auth/register
    // @access    Public
    public signupHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { error, parsedErrors } = parse_joi_error(signupSchema, req);

            if (error) {
                throw new ErrorResponse(error.message, 400, parsedErrors);
            }

            const data = await this.authService.signup(req.body);

            emailEmitter.emit(EVENTS_NAMES.user_register, data);

            return res.status(201).json({
                success: true,
                message: "User Successfully Created",
                payload: data.user
            });

        } catch (e) {
            next(e);
        }
    }

    // @desc      Login user
    // @route     POST /api/v1/auth/login
    // @access    Public
    public signinHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { error, parsedErrors } = parse_joi_error(signinSchema, req);

            if (error) {
                throw new ErrorResponse(error.message, 400, parsedErrors);
            }

            const { token, data } = await this.authService.signin(req.body);

            return res.status(200).json({
                success: true,
                message: "User successfully logged in",
                payload: {
                    token,
                    data
                },
            });

        } catch (e) {
            next(e);
        }
    }

    // @desc      Log user out / clear cookie
    // @route     GET /api/v1/auth/logout
    // @access    Private
    public signoutHandler = async (_, res: Response, next: NextFunction) => {
        try {

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


            const { error, parsedErrors } = parse_joi_error(forgotPasswordSchema, req);

            if (error) {
                throw new ErrorResponse(error.message, 400, parsedErrors);
            }

            const { user, resetToken } = await this.authService.forgotPassword(req.body);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

            try {

                emailEmitter.emit(EVENTS_NAMES.user_forgot_passwd, user, resetUrl);

            } catch (err) {
                logger.error(err);
            }

            return res.status(200).json({
                success: true,
                message: "If the email exists, You will receive an email with reset instructions",
                data: {
                    user: user,
                    resetToken: resetToken
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

