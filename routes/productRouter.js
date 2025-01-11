import express from "express";

const router = express.Router();

import { addProduct } from "../controllers/productsController.js";

router.post("/addProduct", addProduct);

export default router;
