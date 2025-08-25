import type { Express } from "express";
import { createServer, type Server } from "http";
import { DbStorage } from "./db-storage";
import { MemStorage } from "./storage";
import { AuthService, createSessionUser, type SessionUser } from "./auth";
import { requireAuth, requireAdmin } from "./middleware/auth";
import { rssParser } from "./services/rss-parser";
import { insertNewsletterSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Use memory storage if DATABASE_URL is not available, otherwise use DB storage
const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
const authService = new AuthService(storage as any);

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

const searchSchema = z.object({
  q: z.string().min(1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20)
});

const paginationSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0)
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await authService.register(userData);
      const sessionUser = createSessionUser(user);
      
      req.session.user = sessionUser;
      res.status(201).json({ 
        message: "User registered successfully", 
        user: sessionUser 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await authService.login(username, password);
      const sessionUser = createSessionUser(user);
      
      req.session.user = sessionUser;
      res.json({ 
        message: "Login successful", 
        user: sessionUser 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ error: message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session?.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategoriesWithCount();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get all articles with pagination
  app.get("/api/articles", async (req, res) => {
    try {
      const { limit, offset } = paginationSchema.parse(req.query);
      const articles = await storage.getAllArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get featured articles
  app.get("/api/articles/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  // Get breaking news
  app.get("/api/articles/breaking", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const articles = await storage.getBreakingNews(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch breaking news" });
    }
  });

  // Get trending articles
  app.get("/api/articles/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const articles = await storage.getTrendingArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending articles" });
    }
  });

  // Search articles
  app.get("/api/articles/search", async (req, res) => {
    try {
      const { q: query, limit } = searchSchema.parse(req.query);
      const articles = await storage.searchArticles(query, limit);
      res.json(articles);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Search query is required" });
      }
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // Get articles by category
  app.get("/api/categories/:slug/articles", async (req, res) => {
    try {
      const { slug } = req.params;
      const { limit, offset } = paginationSchema.parse(req.query);
      const articles = await storage.getArticlesByCategory(slug, limit, offset);
      res.json(articles);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      res.status(500).json({ error: "Failed to fetch articles for category" });
    }
  });

  // Get single article by slug
  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Update view count
      await storage.updateArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Get related articles by slug
  app.get("/api/articles/slug/:slug/related", async (req, res) => {
    try {
      const { slug } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const relatedArticles = await storage.getRelatedArticles(slug, limit);
      res.json(relatedArticles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch related articles" });
    }
  });

  // Like/unlike article
  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const { increment = true } = req.body;
      
      await storage.updateArticleLikes(id, increment);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update article likes" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getNewsletterByEmail(data.email);
      if (existingSubscription) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      
      const subscription = await storage.createNewsletterSubscription(data);
      res.status(201).json({ message: "Successfully subscribed to newsletter", id: subscription.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Admin routes
  app.post("/api/admin/fetch-rss", requireAdmin, async (_req, res) => {
    try {
      await rssParser.fetchAllFeeds();
      res.json({ message: "RSS feeds fetched successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  // Test Telegram Bot connection
  app.post("/api/admin/test-telegram", requireAdmin, async (_req, res) => {
    try {
      const { telegramBot } = await import("./services/telegram-bot");
      const success = await telegramBot.testConnection();
      
      if (success) {
        res.json({ message: "Telegram Bot successfully connected and test message sent!" });
      } else {
        res.status(500).json({ error: "Failed to connect to Telegram Bot" });
      }
    } catch (error) {
      console.error("Telegram test error:", error);
      res.status(500).json({ error: "Failed to test Telegram Bot" });
    }
  });

  // Debug Telegram configuration
  app.get("/api/admin/telegram-info", requireAdmin, async (_req, res) => {
    try {
      const chatId = process.env.TELEGRAM_CHAT_ID || "";
      const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
      
      if (!botToken) {
        return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
      }

      // Get bot info
      const botResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const botInfo = await botResponse.json();

      // Try to get chat info
      let chatInfo = null;
      if (chatId) {
        try {
          const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`);
          const chatData = await chatResponse.json();
          chatInfo = chatData;
        } catch (error) {
          console.error("Error getting chat info:", error);
        }
      }

      res.json({
        botInfo: botInfo,
        currentChatId: chatId,
        chatInfo: chatInfo,
        instructions: {
          forChannel: "Channel ID format: -100xxxxxxxxx (starts with -100)",
          forGroup: "Group ID format: -xxxxxxxxx (starts with -)",
          forPrivate: "Private chat ID: positive number",
          howToGetChannelId: "1. Add bot to channel as admin, 2. Send message to channel, 3. Visit https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates"
        }
      });
    } catch (error) {
      console.error("Error getting Telegram info:", error);
      res.status(500).json({ error: "Failed to get Telegram info" });
    }
  });

  // Send article to Telegram manually
  app.post("/api/admin/send-to-telegram/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      const { telegramBot } = await import("./services/telegram-bot");
      const success = await telegramBot.sendArticle(article);
      
      if (success) {
        res.json({ message: "Article sent to Telegram successfully" });
      } else {
        res.status(500).json({ error: "Failed to send article to Telegram" });
      }
    } catch (error) {
      console.error("Send to Telegram error:", error);
      res.status(500).json({ error: "Failed to send article to Telegram" });
    }
  });

  // Test AI translation
  app.post("/api/admin/test-ai-translation", requireAdmin, async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: "GEMINI_API_KEY not configured" });
      }

      const { title, content, categoryId } = req.body;
      
      if (!title || !content || !categoryId) {
        return res.status(400).json({ error: "Title, content and categoryId are required" });
      }

      const category = await storage.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const { aiGenerator } = await import("./services/ai-generator");
      if (!aiGenerator) {
        return res.status(500).json({ error: "AI Generator not available" });
      }

      const result = await aiGenerator.translateAndRewriteArticle(title, content, category);
      res.json(result);
    } catch (error) {
      console.error("AI translation test error:", error);
      res.status(500).json({ error: "Failed to test AI translation" });
    }
  });

  // Get all RSS feeds for admin
  app.get("/api/admin/rss-feeds", requireAdmin, async (_req, res) => {
    try {
      const feeds = await storage.getAllRssFeeds();
      res.json(feeds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  // Create new RSS feed
  app.post("/api/admin/rss-feeds", requireAdmin, async (req, res) => {
    try {
      const feedData = req.body;
      const feed = await storage.createRssFeed(feedData);
      res.status(201).json(feed);
    } catch (error) {
      res.status(500).json({ error: "Failed to create RSS feed" });
    }
  });

  // Get all newsletters for admin
  app.get("/api/admin/newsletters", requireAdmin, async (_req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch newsletters" });
    }
  });

  // Create new article (admin)
  app.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const articleData = req.body;
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // Toggle article featured status
  app.patch("/api/admin/articles/:id/featured", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;
      await storage.updateArticleFeatured(id, isFeatured);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // Toggle article breaking status
  app.patch("/api/admin/articles/:id/breaking", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isBreaking } = req.body;
      await storage.updateArticleBreaking(id, isBreaking);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // AI Content Generation endpoints
  app.post("/api/admin/ai/improve-article/:id", requireAdmin, async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: "GEMINI_API_KEY not configured" });
      }

      const { id } = req.params;
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      const { aiGenerator } = await import("./services/ai-generator");
      const improved = await aiGenerator?.improveExistingArticle(article);
      
      res.json(improved);
    } catch (error) {
      console.error("AI improvement error:", error);
      res.status(500).json({ error: "Failed to improve article with AI" });
    }
  });

  app.post("/api/admin/ai/generate-article", requireAdmin, async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: "GEMINI_API_KEY not configured" });
      }

      const { categoryId } = req.body;
      const category = await storage.getCategoryById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const { aiGenerator } = await import("./services/ai-generator");
      const generated = await aiGenerator?.generateOriginalArticle(category);
      
      res.json(generated);
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ error: "Failed to generate article with AI" });
    }
  });

  // Get sitemap for SEO
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const articles = await storage.getAllArticles(1000, 0);
      const categories = await storage.getAllCategories();
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.SITE_URL || 'http://localhost:5000'}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      // Add category pages
      for (const category of categories) {
        sitemap += `
  <url>
    <loc>${process.env.SITE_URL || 'http://localhost:5000'}/category/${category.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      // Add article pages
      for (const article of articles) {
        sitemap += `
  <url>
    <loc>${process.env.SITE_URL || 'http://localhost:5000'}/article/${article.slug}</loc>
    <lastmod>${article.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  });

  // Health check endpoint for deployment
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);
  
  // Set up periodic RSS fetching (every 30 minutes)
  setInterval(async () => {
    try {
      console.log("Starting scheduled RSS feed fetch...");
      await rssParser.fetchAllFeeds();
      console.log("Scheduled RSS feed fetch completed");
    } catch (error) {
      console.error("Error during scheduled RSS fetch:", error);
    }
  }, 30 * 60 * 1000); // 30 minutes

  return httpServer;
}
