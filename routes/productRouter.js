import express from "express";

const router = express.Router();

import {
  addProduct,
  getAllProducts,
  editProduct,
} from "../controllers/productController.js";

router.post("/addProduct", addProduct);
router.patch("/editProduct/:id", editProduct);
router.get("/allProducts", getAllProducts);
export default router;
