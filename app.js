import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./routes/authRouter.js";
import { globalErrorHandler, AppError } from "./utilites.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.use("/", (req, res, next) =>
  next(new AppError("No such Route Founded....", 404))
);
app.use(globalErrorHandler);
export default app;
