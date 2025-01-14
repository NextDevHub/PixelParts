///// authetication Router
import {
  register,
  logIn,
  adminRegister,
  restrictTo,
  validateLoggedIn,
} from "../controllers/authController.js";

import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/adminRegister", validateLoggedIn, restrictTo("Admin"), register);
router.post("/logIn", logIn);

export default router;
