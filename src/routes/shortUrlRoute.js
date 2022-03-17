import { Router } from "express";
import { deleteShortUrl, generateShorten, getShortUrl } from "../controllers/shortUrlController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const shortUrlRoute = Router();

shortUrlRoute.post("/urls/shorten", validateTokenMiddleware, generateShorten);
shortUrlRoute.get("/urls/:shortUrl", getShortUrl);
shortUrlRoute.delete("/urls/:id", validateTokenMiddleware, deleteShortUrl);

export default shortUrlRoute;