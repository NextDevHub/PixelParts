import express from "express";

const router = express.Router();
import { updateMyInfo } from "../controllers/userController.js";
router.patch("/updateMyInfo/:id", updateMyInfo);
export default router;
