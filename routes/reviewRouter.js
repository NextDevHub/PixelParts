import express from "express";
import { addReview } from "../controllers/reviewController.js";
import { validateLoggedIn, restrictTo } from "../controllers/authController.js";
const router = express.Router();

router.use(validateLoggedIn, restrictTo("User"));
router.post("/addReview/:productId", addReview);
export default router;
