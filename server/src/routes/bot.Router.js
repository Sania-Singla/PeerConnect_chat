import express from "express"
import { quickBot } from "../controllers/bot.controller";
export const botRouter = express.Router();

botRouter.route("/quick-bot").post(quickBot);

