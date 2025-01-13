import express from "express";

const router = express.Router();

import {
  addProduct,
  getAllProducts,
  editProduct,
  getProduct,
} from "../controllers/productController.js";
import { uploadPhoto, uploadToCloud } from "../utilites.js";

router.post("/addProduct", addProduct);
router.get("/getProduct/:param", getProduct);
router.patch("/editProduct/:id", uploadPhoto, uploadToCloud, editProduct);
router.get("/allProducts", getAllProducts);
export default router;
