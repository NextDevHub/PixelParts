import express from "express";

const router = express.Router();
import { updateMyInfo, getAllUsers } from "../controllers/userController.js";
import { restrictTo, validateLoggedIn } from "../controllers/authController.js";
router.patch(
  "/updateMyInfo",
  validateLoggedIn,
  restrictTo("Admin", "User"),
  updateMyInfo
);
router.get("/getAllUsers", validateLoggedIn, restrictTo("Admin"), getAllUsers);
export default router;
