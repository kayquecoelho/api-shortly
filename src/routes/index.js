import { Router } from "express";
import authRouter from "./authRouter.js";
import shortUrlRoute from "./shortUrlRoute.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(shortUrlRoute);

export default router;