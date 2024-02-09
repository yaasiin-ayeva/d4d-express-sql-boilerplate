import { Router } from "express";
import apiv1Router from "@routes/index.route.v1";

const apiRouter = Router();

apiRouter.use("/v1", apiv1Router);

export default apiRouter;