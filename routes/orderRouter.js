import express from "express";

const router = express.Router();
import {
  getCheckoutSession,
  addOrder,
  getAllOrders,
  getMyOrders,
} from "../controllers/orderController.js";
import { validateLoggedIn, restrictTo } from "../controllers/authController.js";
router.use(validateLoggedIn);

router.get("/allOrders", restrictTo("Admin"), getAllOrders);

router.use(restrictTo("User"));
router.get("/create-checkout-session/:orderId/:totalPrice", getCheckoutSession);
router.post("/addOrder", addOrder);
router.get("/getMyOrders", getMyOrders);
export default router;
