import { z } from "zod";

// Base types inferred from database tables
export type User = {
  id: string;
  username: string;
  password: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  createdAt: Date;
};

export type Article = {
  id: string;
  slug: string;
  imageUrl: string | null;
  imageAttribution: string | null;
  imageAuthor: string | null;
  imageAuthorUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  categoryId: string;
  publishedAt: Date;
  createdAt: Date;
  views: number;
  likes: number;
  isBreaking: string;
  isFeatured: string;
};

export type ArticleTranslation = {
  id: string;
  articleId: string;
  languageCode: string;
  title: string;
  description: string | null;
  content: string;
  createdAt: Date;
};

export type RssFeed = {
  id: string;
  url: string;
  name: string;
  categoryId: string;
  isActive: string;
  lastFetchedAt: Date | null;
  createdAt: Date;
};

export type Newsletter = {
  id: string;
  email: string;
  isActive: string;
  createdAt: Date;
};

export type PushSubscription = {
  id: string;
  endpoint: string;
  keys: any; // JSON object {p256dh: string, auth: string}
  userAgent: string | null;
  isActive: string;
  createdAt: Date;
};

export type Story = {
  id: string;
  title: string;
  description: string | null;
  categoryId: string | null;
  thumbnail: string | null;
  isActive: string;
  order: number;
  createdAt: Date;
  expiresAt: Date | null;
  viewCount: number;
};

export type StoryItem = {
  id: string;
  storyId: string;
  articleId: string | null;
  type: string;
  mediaUrl: string | null;
  title: string | null;
  content: string | null;
  duration: number;
  order: number;
  createdAt: Date;
};

// Insert types for forms and API
export type InsertUser = {
  username: string;
  password: string;
};

export type InsertCategory = {
  name: string;
  slug: string;
  icon: string;
  color: string;
};

export type InsertArticle = {
  slug: string;
  imageUrl?: string | null;
  imageAttribution?: string | null;
  imageAuthor?: string | null;
  imageAuthorUrl?: string | null;
  sourceUrl: string;
  sourceName: string;
  categoryId: string;
  publishedAt: Date;
  isBreaking?: string;
  isFeatured?: string;
};

export type InsertArticleTranslation = {
  articleId: string;
  languageCode: string;
  title: string;
  description?: string | null;
  content: string;
};

export type InsertRssFeed = {
  url: string;
  name: string;
  categoryId: string;
  isActive?: string;
};

export type InsertNewsletter = {
  email: string;
  isActive?: string;
};

export type InsertPushSubscription = {
  endpoint: string;
  keys: any;
  userAgent?: string | null;
  isActive?: string;
};

export type InsertStory = {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  thumbnail?: string | null;
  isActive?: string;
  order?: number;
  expiresAt?: Date | null;
};

export type InsertStoryItem = {
  storyId: string;
  articleId?: string | null;
  type?: string;
  mediaUrl?: string | null;
  title?: string | null;
  content?: string | null;
  duration?: number;
  order?: number;
};

// Extended types for API responses
export type ArticleWithCategory = Article & {
  category: Category;
  translations?: ArticleTranslation[];
  // Flattened translation fields for current language
  title: string;
  description?: string;
  content: string;
  language: string;
};

export type ArticleWithTranslations = Article & {
  category: Category;
  translations: ArticleTranslation[];
};

export type CategoryWithCount = Category & {
  articleCount: number;
};

// Extended types for Stories
export type StoryWithItems = Story & {
  category?: Category;
  items: StoryItem[];
};

export type StoryWithCategory = Story & {
  category?: Category;
  itemCount: number;
};