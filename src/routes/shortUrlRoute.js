import { Router } from "express";
import { generateShorten, getShortUrl } from "../controllers/shortUrlController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const shortUrlRoute = Router();

shortUrlRoute.post("/urls/shorten", validateTokenMiddleware, generateShorten);
shortUrlRoute.get("/urls/:shortUrl", getShortUrl);

export default shortUrlRoute;