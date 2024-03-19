import { Router } from "express";
import AuthController from "../../controllers/auth/auth.controller";

const controller = new AuthController();
const authRoutes = Router();

authRoutes.post('/sign-in', controller.signinHandler);
authRoutes.post('/sign-up', controller.signupHandler);
authRoutes.get('/sign-out', controller.signoutHandler);
authRoutes.post('/forgot-password', controller.forgotPasswordHandler);

export default authRoutes;