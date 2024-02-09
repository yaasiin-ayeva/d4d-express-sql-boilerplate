import { Router } from "express";
import AuthController from "@controllers/auth.controller";

const controller = new AuthController();
const authRoutes = Router();

authRoutes.post('/login', controller.loginHandler);
authRoutes.get('/forgot-password', controller.forgotPasswordHandler);
authRoutes.get('/logout', controller.logoutHandler);

export default authRoutes;