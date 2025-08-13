import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { rssParser } from "./services/rss-parser";
import { insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20)
});

const paginationSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0)
});

export async function registerRoutes(app: Express): Promise<Server> {
  
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
  app.post("/api/admin/fetch-rss", async (_req, res) => {
    try {
      await rssParser.fetchAllFeeds();
      res.json({ message: "RSS feeds fetched successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  // Get all RSS feeds for admin
  app.get("/api/admin/rss-feeds", async (_req, res) => {
    try {
      const feeds = await storage.getAllRssFeeds();
      res.json(feeds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  // Create new RSS feed
  app.post("/api/admin/rss-feeds", async (req, res) => {
    try {
      const feedData = req.body;
      const feed = await storage.createRssFeed(feedData);
      res.status(201).json(feed);
    } catch (error) {
      res.status(500).json({ error: "Failed to create RSS feed" });
    }
  });

  // Get all newsletters for admin
  app.get("/api/admin/newsletters", async (_req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch newsletters" });
    }
  });

  // Create new article (admin)
  app.post("/api/admin/articles", async (req, res) => {
    try {
      const articleData = req.body;
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // Toggle article featured status
  app.patch("/api/admin/articles/:id/featured", async (req, res) => {
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
  app.patch("/api/admin/articles/:id/breaking", async (req, res) => {
    try {
      const { id } = req.params;
      const { isBreaking } = req.body;
      await storage.updateArticleBreaking(id, isBreaking);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
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
