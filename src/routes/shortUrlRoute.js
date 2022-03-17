import { Router } from "express";
import { generateShorten } from "../controllers/shortUrlController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const shortUrlRoute = Router();

shortUrlRoute.post("/urls/shorten", validateTokenMiddleware, generateShorten);

export default shortUrlRoute;