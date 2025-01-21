import express from "express";

const router = express.Router();
import {
  updateMyInfo,
  getAllUsers,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";
import { restrictTo, validateLoggedIn } from "../controllers/authController.js";
router.patch(
  "/updateMyInfo",
  validateLoggedIn,
  restrictTo("Admin", "User"),
  updateMyInfo
);
router.get("/getAllUsers", validateLoggedIn, restrictTo("Admin"), getAllUsers);
router.patch(
  "/updateUser/:id",
  validateLoggedIn,
  restrictTo("Admin"),
  updateUser
);
router.patch(
  "/updateMyPassword",
  validateLoggedIn,
  restrictTo("User", "Admin"),
  updatePassword
);
export default router;
