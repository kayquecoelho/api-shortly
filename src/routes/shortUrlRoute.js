import { Route } from "express";
import { generateShorten } from "../controllers/shortUrlController";

const shortUrlRoute = Route();

shortUrlRoute.post("/urls/shorten", generateShorten );

export default shortUrlRoute;