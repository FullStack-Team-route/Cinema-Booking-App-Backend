import { Router } from "express";
import { handleChat, getChatbotInfo, clearConversation } from "../controllers/chatbotController.js";

const router = Router();

// POST /api/chatbot/message - Send a message to the chatbot
router.post("/message", handleChat);

// GET /api/chatbot/info - Get chatbot information
router.get("/info", getChatbotInfo);

// POST /api/chatbot/clear - Clear conversation history
router.post("/clear", clearConversation);

export default router;
