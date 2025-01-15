import express from "express";
import {
  addOffer,
  editOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import { restrictTo, validateLoggedIn } from "../controllers/authController.js";
const router = express.Router();

router.use(validateLoggedIn, restrictTo("Admin"));
router.post("/addOffer/:productId", addOffer);
router.patch("/editOffer/:productId", editOffer);
router.delete("/deleteOffer/:productId", deleteOffer);
export default router;
