import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieparser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import offerRouter from "./routes/offerRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import imgRouter from "./routes/productImgsRouter.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import orderRouter from "./routes/orderRouter.js";
import statsRouter from "./routes/statsRouter.js";
import { webhookCheckout } from "./controllers/orderController.js";
import { globalErrorHandler, AppError } from "./utilites.js";
dotenv.config();
const app = express();

app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/offer", offerRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/img", imgRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/stats", statsRouter);

app.use("/", (req, res, next) =>
  next(new AppError("No such Route Founded....", 404))
);
app.use(globalErrorHandler);
export default app;
