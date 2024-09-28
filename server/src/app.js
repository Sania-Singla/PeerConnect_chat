import express from "express";
export const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../public"));
app.use(cookieParser());

import { userRouter } from "./routes/userRoutes.js";
import { postRouter } from "./routes/postRoutes.js";
import { followerRouter } from "./routes/followerRoutes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/followers", followerRouter);
