///// authetication Router
import { register, logIn } from "../controllers/authController.js";

import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/logIn", logIn);

export default router;
