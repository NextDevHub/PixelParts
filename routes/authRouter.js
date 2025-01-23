///// authetication Router
import {
  register,
  logIn,
  adminRegister,
  restrictTo,
  validateLoggedIn,
} from "../controllers/authController.js";
import { registerGoogleController } from "../controllers/authGoogleController.js";
import pass from "./../passportConfig.js";
import passport from "passport";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  registerGoogleController
);

router.post("/adminRegister", validateLoggedIn, restrictTo("Admin"), register);
router.post("/logIn", logIn);

export default router;
