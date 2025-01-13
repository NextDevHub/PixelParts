import express from "express";

const router = express.Router();

import {
  addProduct,
  getAllProducts,
  editProduct,
  getProduct,
} from "../controllers/productController.js";

router.post("/addProduct", addProduct);
router.get("/getProduct/:productId", getProduct);
router.patch("/editProduct/:id", editProduct);
router.get("/allProducts", getAllProducts);
export default router;
