import express from "express";
import { addImg, editImg } from "../controllers/imgController.js";
import { uploadPhoto, uploadToCloud } from "../utilites.js";
const router = express.Router();
router.use(uploadPhoto, uploadToCloud);
router.post("/addImg/:productId", addImg);
router.patch("/editImg/:imageId", editImg);
export default router;
