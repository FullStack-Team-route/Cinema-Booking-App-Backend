import type { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Movie } from "../models/Movie.js";
import { Slot } from "../models/Slot.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ============== RATE LIMITING ==============
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 20; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Clean up expired rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Check rate limit for an IP
const checkRateLimit = (ip: string): { allowed: boolean; remaining: number; resetIn: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetTime - now };
};

// ============== CONVERSATION HISTORY ==============
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ConversationSession {
  messages: ChatMessage[];
  lastActivity: number;
}

const conversationStore = new Map<string, ConversationSession>();
const MAX_HISTORY_LENGTH = 10; // Keep last 10 messages
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of conversationStore.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      conversationStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Get or create conversation session
const getConversation = (sessionId: string): ConversationSession => {
  let session = conversationStore.get(sessionId);
  
  if (!session || Date.now() - session.lastActivity > SESSION_TIMEOUT) {
    session = { messages: [], lastActivity: Date.now() };
    conversationStore.set(sessionId, session);
  }
  
  return session;
};

// Add message to conversation
const addToConversation = (sessionId: string, role: "user" | "assistant", content: string) => {
  const session = getConversation(sessionId);
  session.messages.push({ role, content, timestamp: Date.now() });
  
  // Keep only last N messages
  if (session.messages.length > MAX_HISTORY_LENGTH) {
    session.messages = session.messages.slice(-MAX_HISTORY_LENGTH);
  }
  
  session.lastActivity = Date.now();
};

// Format conversation history for prompt
const formatConversationHistory = (sessionId: string): string => {
  const session = getConversation(sessionId);
  
  if (session.messages.length === 0) {
    return "";
  }
  
  let history = "\n---\nسجل المحادثة السابقة:\n";
  for (const msg of session.messages) {
    const prefix = msg.role === "user" ? "العميل" : "سينما بوت";
    history += `${prefix}: ${msg.content}\n`;
  }
  
  return history;
};

// Clear conversation history
export const clearConversation = async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId || req.ip || "anonymous";
  conversationStore.delete(sessionId);
  
  return res.status(200).json({
    statusMsg: "success",
    message: "تم مسح سجل المحادثة",
  });
};

// System prompt for the chatbot
const SYSTEM_PROMPT = `أنت مساعد ذكي لموقع سينما لحجز التذاكر. اسمك "سينما بوت".

مهمتك:
1. الإجابة على استفسارات العملاء عن الأفلام المتاحة
2. تقديم توصيات للأفلام بناءً على تفضيلات العميل
3. مساعدة العملاء في معرفة مواعيد العروض
4. تقديم معلومات عن الأفلام (القصة، التقييم، المدة، الممثلين)

قواعد مهمة:
- رد دائماً بالعربية
- كن ودوداً ومختصراً
- استخدم المعلومات المتاحة فقط من قائمة الأفلام
- إذا سأل العميل عن فيلم غير موجود، اعتذر واقترح أفلام مشابهة
- لا تخترع معلومات غير موجودة في البيانات

عند التوصية بفيلم:
- اذكر اسم الفيلم والتقييم والتصنيف
- اذكر مدة الفيلم
- اذكر نبذة قصيرة عن القصة
- اذكر مواعيد العرض إذا كانت متاحة`;

// Format movies data for the AI context
const formatMoviesContext = async () => {
  try {
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get active movies with their slots (only today and future dates)
    const movies = await Movie.find({ isActive: true })
      .populate({
        path: "slots",
        match: { 
          isActive: true,
          date: { $gte: today }  // Filter: only today and future dates
        },
        populate: { path: "auditorium" },
      })
      .lean();

    if (!movies || movies.length === 0) {
      return "لا توجد أفلام متاحة حالياً.";
    }

    let context = "قائمة الأفلام المتاحة:\n\n";

    for (const movie of movies) {
      context += `🎬 ${movie.title}\n`;
      context += `   - التصنيف: ${(movie.genres as string[])?.join(", ") || "غير محدد"}\n`;
      context += `   - التقييم: ${movie.rating || "غير محدد"}/10\n`;
      context += `   - المدة: ${movie.duration} دقيقة\n`;
      context += `   - اللغة: ${movie.language || "غير محدد"}\n`;
      context += `   - الوصف: ${movie.shortDescription || movie.description?.substring(0, 200) || "غير متاح"}\n`;

      // Add cast info if available
      if (movie.cast && (movie.cast as any[]).length > 0) {
        const castNames = (movie.cast as any[])
          .slice(0, 3)
          .map((c: any) => c.name)
          .join(", ");
        context += `   - الممثلين: ${castNames}\n`;
      }

      // Add directors if available
      if (movie.directors && (movie.directors as any[]).length > 0) {
        const directorNames = (movie.directors as any[])
          .map((d: any) => d.name)
          .join(", ");
        context += `   - المخرج: ${directorNames}\n`;
      }

      // Add showtimes if available
      const slots = (movie as any).slots;
      if (slots && slots.length > 0) {
        context += `   - مواعيد العرض:\n`;
        const groupedSlots: { [key: string]: string[] } = {};

        for (const slot of slots.slice(0, 5)) {
          const dateStr = new Date(slot.date).toLocaleDateString("ar-EG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const timeStr = `${slot.time} ${slot.ampm}`;
          if (!groupedSlots[dateStr]) {
            groupedSlots[dateStr] = [];
          }
          groupedSlots[dateStr].push(timeStr);
        }

        for (const [date, times] of Object.entries(groupedSlots)) {
          context += `     • ${date}: ${times.join(" - ")}\n`;
        }
      }

      context += "\n";
    }

    return context;
  } catch (error) {
    console.error("Error formatting movies context:", error);
    return "حدث خطأ في جلب بيانات الأفلام.";
  }
};

// Handle chat message
export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;
    
    // Get client IP and session ID for rate limiting and history
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const sessionId = clientSessionId || clientIp;

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        statusMsg: "error",
        message: "لقد تجاوزت الحد المسموح من الرسائل. يرجى الانتظار قليلاً.",
        retryAfter: Math.ceil(rateLimit.resetIn / 1000),
      });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        statusMsg: "error",
        message: "يجب إرسال رسالة نصية",
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        statusMsg: "error",
        message: "Gemini API key is not configured",
      });
    }

    // Get movies context
    const moviesContext = await formatMoviesContext();

    // Get conversation history
    const conversationHistory = formatConversationHistory(sessionId);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build the full prompt with conversation history
    const fullPrompt = `${SYSTEM_PROMPT}

${moviesContext}
${conversationHistory}
---
رسالة العميل الجديدة: ${message}

الرد:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const reply = response.text();

    // Save to conversation history
    addToConversation(sessionId, "user", message);
    addToConversation(sessionId, "assistant", reply.trim());

    return res.status(200).json({
      statusMsg: "success",
      reply: reply.trim(),
      rateLimit: {
        remaining: rateLimit.remaining,
        resetIn: Math.ceil(rateLimit.resetIn / 1000),
      },
    });
  } catch (error: any) {
    console.error("Chatbot error:", error);

    // Handle specific Gemini API errors
    if (error.message?.includes("API key")) {
      return res.status(500).json({
        statusMsg: "error",
        message: "خطأ في إعدادات API key",
      });
    }

    return res.status(500).json({
      statusMsg: "error",
      message: "حدث خطأ في معالجة الرسالة، يرجى المحاولة مرة أخرى",
    });
  }
};

// Get chatbot info
export const getChatbotInfo = async (_req: Request, res: Response) => {
  return res.status(200).json({
    statusMsg: "success",
    name: "سينما بوت",
    description: "مساعد ذكي لموقع حجز تذاكر السينما",
    capabilities: [
      "الاستعلام عن الأفلام المتاحة",
      "توصيات الأفلام حسب التصنيف",
      "معرفة مواعيد العروض",
      "معلومات عن الأفلام والممثلين",
    ],
  });
};
