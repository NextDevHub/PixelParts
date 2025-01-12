import express from "express";
import { addOffer, editOffer } from "../controllers/offerController.js";

const router = express.Router();
router.post("/addOffer/:productId", addOffer);
router.patch("/editOffer/:productId", editOffer);
export default router;
