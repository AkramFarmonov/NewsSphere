import { type User, type InsertUser, type Article, type InsertArticle, type Category, type InsertCategory, type RssFeed, type InsertRssFeed, type Newsletter, type InsertNewsletter, type ArticleWithCategory, type CategoryWithCount } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoriesWithCount(): Promise<CategoryWithCount[]>;

  // Article methods
  getAllArticles(limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getArticleById(id: string): Promise<ArticleWithCategory | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categorySlug: string, limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getFeaturedArticles(limit?: number): Promise<ArticleWithCategory[]>;
  getBreakingNews(limit?: number): Promise<ArticleWithCategory[]>;
  getTrendingArticles(limit?: number): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticleViews(id: string): Promise<void>;
  updateArticleLikes(id: string, increment: boolean): Promise<void>;
  searchArticles(query: string, limit?: number): Promise<ArticleWithCategory[]>;

  // RSS Feed methods
  getAllRssFeeds(): Promise<RssFeed[]>;
  getActiveRssFeeds(): Promise<RssFeed[]>;
  createRssFeed(feed: InsertRssFeed): Promise<RssFeed>;
  updateRssFeedLastFetched(id: string): Promise<void>;

  // Newsletter methods
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterByEmail(email: string): Promise<Newsletter | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private articles: Map<string, Article>;
  private rssFeeds: Map<string, RssFeed>;
  private newsletters: Map<string, Newsletter>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.rssFeeds = new Map();
    this.newsletters = new Map();
    
    // Initialize with default categories
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const defaultCategories = [
      { name: "O'zbekiston", slug: "ozbekiston", icon: "fas fa-flag", color: "#1a365d" },
      { name: "Dunyo", slug: "dunyo", icon: "fas fa-globe", color: "#2d3748" },
      { name: "Sport", slug: "sport", icon: "fas fa-futbol", color: "#green-600" },
      { name: "Texnologiya", slug: "texnologiya", icon: "fas fa-microchip", color: "#3182ce" },
      { name: "Iqtisodiyot", slug: "iqtisodiyot", icon: "fas fa-chart-line", color: "#d69e2e" },
      { name: "Madaniyat", slug: "madaniyat", icon: "fas fa-theater-masks", color: "#805ad5" },
      { name: "Siyosat", slug: "siyosat", icon: "fas fa-landmark", color: "#2b6cb0" }
    ];

    for (const categoryData of defaultCategories) {
      const category: Category = {
        id: randomUUID(),
        ...categoryData,
        createdAt: new Date()
      };
      this.categories.set(category.id, category);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      ...insertCategory,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async getCategoriesWithCount(): Promise<CategoryWithCount[]> {
    const categories = Array.from(this.categories.values());
    return categories.map(category => ({
      ...category,
      articleCount: Array.from(this.articles.values()).filter(article => article.categoryId === category.id).length
    }));
  }

  // Article methods
  async getAllArticles(limit = 20, offset = 0): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
    
    return this.enrichArticlesWithCategories(articles);
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const enriched = await this.enrichArticlesWithCategories([article]);
    return enriched[0];
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = Array.from(this.articles.values()).find(a => a.slug === slug);
    if (!article) return undefined;
    
    const enriched = await this.enrichArticlesWithCategories([article]);
    return enriched[0];
  }

  async getArticlesByCategory(categorySlug: string, limit = 20, offset = 0): Promise<ArticleWithCategory[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];

    const articles = Array.from(this.articles.values())
      .filter(article => article.categoryId === category.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);

    return this.enrichArticlesWithCategories(articles);
  }

  async getFeaturedArticles(limit = 5): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.isFeatured === "true")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return this.enrichArticlesWithCategories(articles);
  }

  async getBreakingNews(limit = 5): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.isBreaking === "true")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return this.enrichArticlesWithCategories(articles);
  }

  async getTrendingArticles(limit = 5): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, limit);

    return this.enrichArticlesWithCategories(articles);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      id,
      ...insertArticle,
      createdAt: new Date(),
      views: 0,
      likes: 0
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticleViews(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(id, article);
    }
  }

  async updateArticleLikes(id: string, increment: boolean): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.likes = (article.likes || 0) + (increment ? 1 : -1);
      this.articles.set(id, article);
    }
  }

  async searchArticles(query: string, limit = 20): Promise<ArticleWithCategory[]> {
    const lowercaseQuery = query.toLowerCase();
    const articles = Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.description?.toLowerCase().includes(lowercaseQuery) ||
        article.content?.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return this.enrichArticlesWithCategories(articles);
  }

  private async enrichArticlesWithCategories(articles: Article[]): Promise<ArticleWithCategory[]> {
    return articles.map(article => {
      const category = this.categories.get(article.categoryId);
      return {
        ...article,
        category: category!
      };
    });
  }

  // RSS Feed methods
  async getAllRssFeeds(): Promise<RssFeed[]> {
    return Array.from(this.rssFeeds.values());
  }

  async getActiveRssFeeds(): Promise<RssFeed[]> {
    return Array.from(this.rssFeeds.values()).filter(feed => feed.isActive === "true");
  }

  async createRssFeed(insertFeed: InsertRssFeed): Promise<RssFeed> {
    const id = randomUUID();
    const feed: RssFeed = {
      id,
      ...insertFeed,
      createdAt: new Date(),
      lastFetchedAt: null
    };
    this.rssFeeds.set(id, feed);
    return feed;
  }

  async updateRssFeedLastFetched(id: string): Promise<void> {
    const feed = this.rssFeeds.get(id);
    if (feed) {
      feed.lastFetchedAt = new Date();
      this.rssFeeds.set(id, feed);
    }
  }

  // Newsletter methods
  async createNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const newsletter: Newsletter = {
      id,
      ...insertNewsletter,
      createdAt: new Date()
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | undefined> {
    return Array.from(this.newsletters.values()).find(newsletter => newsletter.email === email);
  }
}

export const storage = new MemStorage();
