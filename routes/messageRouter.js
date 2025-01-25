import express from "express";

const router = express.Router();
import {
  getMessages,
  addMessage,
  answerMessage,
  deleteMyMessage,
} from "../controllers/messageController.js";
import { validateLoggedIn, restrictTo } from "../controllers/authController.js";
router.use(validateLoggedIn);
router.get("/getAllMessages", restrictTo("Admin"), getMessages);
router.post("/addMessage", restrictTo("User"), addMessage);
router.patch("/answerMessage/:messageId", restrictTo("Admin"), answerMessage);
router.delete("/deleteMessage/:messageId", restrictTo("User"), deleteMyMessage);

export default router;
