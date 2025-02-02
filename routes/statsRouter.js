import express from "express";

const router = express.Router();
import {
  getStats,
  getUserStats,
  getOrderStats,
} from "../controllers/statsController.js";

import { validateLoggedIn, restrictTo } from "../controllers/authController.js";
router.use(validateLoggedIn, restrictTo("Admin"));
router.get("/", getStats);
router.get("/userStats", getUserStats);
router.get("/orderStats", getOrderStats);
export default router;
