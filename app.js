import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

app.use("/api/v1", (req, res, next) => {
  res.end("hello from server");
});

export default app;
