import express from "express";

const router = express.Router();
import {
  getCheckoutSession,
  addOrder,
} from "../controllers/orderController.js";
import { validateLoggedIn, restrictTo } from "../controllers/authController.js";
router.use(validateLoggedIn, restrictTo("User"));
router.get("/create-checkout-session/:orderId", getCheckoutSession);
router.post("/addOrder", addOrder);
export default router;
