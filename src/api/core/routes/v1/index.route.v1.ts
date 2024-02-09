import { Router } from "express";
import authRoutes from "@routes/auth.route";

const apiV1Router = Router();

apiV1Router.use('/auth', authRoutes);

export default apiV1Router;