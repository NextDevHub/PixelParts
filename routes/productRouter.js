import express from "express";

const router = express.Router();

import {
  addProduct,
  getAllProducts,
  editProduct,
  getProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { uploadPhoto, uploadToCloud } from "../utilites.js";

import { validateLoggedIn, restrictTo } from "../controllers/authController.js";

router.get("/getProduct/:param", getProduct);
router.get("/allProducts", getAllProducts);
router.use(validateLoggedIn, restrictTo("Admin"));
router.post("/addProduct", addProduct);
router.patch("/editProduct/:id", uploadPhoto, uploadToCloud, editProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
