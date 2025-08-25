import { parseStringPromise } from 'xml2js';
import { storage } from '../storage';
import { aiGenerator } from './ai-generator-improved';
import type { InsertArticleTranslation } from '@shared/schema';
import { telegramBot } from './telegram-bot';
import { unsplashService } from './unsplash';
import type { InsertArticle } from '@shared/schema';

interface RssItem {
  title: string[];
  description?: string[];
  link: string[];
  pubDate: string[];
  'media:content'?: Array<{ $: { url: string } }>;
  enclosure?: Array<{ $: { url: string, type: string } }>;
}

interface RssChannel {
  title: string[];
  description?: string[];
  item: RssItem[];
}

interface RssFeed {
  rss: {
    channel: RssChannel[];
  };
}

export class RssParser {
  private async fetchFeedContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'RealNews RSS Parser 1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error(`Error fetching RSS feed from ${url}:`, error);
      throw error;
    }
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  }

  private extractImageUrl(item: RssItem): string | undefined {
    // Try to get image from media:content
    if (item['media:content'] && item['media:content'][0]) {
      return item['media:content'][0].$.url;
    }
    
    // Try to get image from enclosure
    if (item.enclosure && item.enclosure[0] && item.enclosure[0].$.type?.startsWith('image/')) {
      return item.enclosure[0].$.url;
    }
    
    // Try to extract image from description
    if (item.description && item.description[0]) {
      const imgMatch = item.description[0].match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        return imgMatch[1];
      }
    }
    
    return undefined;
  }

  private cleanContent(content: string): string {
    // Remove HTML tags and normalize whitespace
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async parseFeed(feedUrl: string, categoryId: string, sourceName: string): Promise<{ articleData: InsertArticle; translations: any }[]> {
    try {
      const xmlContent = await this.fetchFeedContent(feedUrl);
      const parsed: RssFeed = await parseStringPromise(xmlContent);
      
      if (!parsed.rss?.channel?.[0]?.item) {
        console.warn(`No items found in RSS feed: ${feedUrl}`);
        return [];
      }
      
      const items = parsed.rss.channel[0].item;
      const articles: InsertArticle[] = [];
      
      for (const item of items) {
        if (!item.title?.[0] || !item.link?.[0]) {
          continue;
        }
        
        const title = this.cleanContent(item.title[0]);
        const slug = this.createSlug(title);
        const sourceUrl = item.link[0];
        
        // Check if article already exists by sourceUrl (more reliable than slug)
        const existingArticle = await storage.getArticleBySourceUrl(sourceUrl);
        if (existingArticle) {
          console.log(`Article already exists, skipping: ${sourceUrl}`);
          continue;
        }
        
        const description = item.description?.[0] 
          ? this.cleanContent(item.description[0]).substring(0, 300)
          : undefined;
        
        const content = item.description?.[0] 
          ? this.cleanContent(item.description[0])
          : undefined;
        
        // Try to get image from RSS feed first, then fallback to Unsplash
        let imageUrl = this.extractImageUrl(item);
        
        // Initialize attribution fields
        let imageAttribution: string | undefined;
        let imageAuthor: string | undefined;
        let imageAuthorUrl: string | undefined;
        
        if (!imageUrl) {
          const category = await storage.getCategoryById(categoryId);
          if (category) {
            const unsplashData = await unsplashService.getArticleImage(title, category.name);
            if (unsplashData) {
              imageUrl = unsplashData.imageUrl;
              imageAttribution = unsplashData.attribution;
              imageAuthor = unsplashData.author;
              imageAuthorUrl = unsplashData.authorUrl;
            }
          }
        }
        
        const publishedAt = item.pubDate?.[0] 
          ? new Date(item.pubDate[0])
          : new Date();
        
        // AI orqali maqolani yaxshilash va tarjima qilish
        let enhancedArticle: { slug: string } = { slug };
        let aiImageKeywords: string[] = [];
        let aiTranslations: any = null;

        try {
          if (process.env.GEMINI_API_KEY && content && aiGenerator) {
            const category = await storage.getCategoryById(categoryId);
            if (category) {
              const enhanced = await aiGenerator.translateAndRewriteArticleMultiLang(
                title,
                content,
                category
              );
              enhancedArticle = {
                slug: enhanced.slug
              };
              aiImageKeywords = enhanced.imageKeywords || [];
              aiTranslations = enhanced; // Store for later use
              
              // Agar rasm hali topilmagan bo'lsa va AI keywords bor bo'lsa, ulardan foydalanish
              if (!imageUrl && aiImageKeywords.length > 0) {
                const unsplashData = await unsplashService.getArticleImageWithKeywords(aiImageKeywords);
                if (unsplashData) {
                  imageUrl = unsplashData.imageUrl;
                  imageAttribution = unsplashData.attribution;
                  imageAuthor = unsplashData.author;
                  imageAuthorUrl = unsplashData.authorUrl;
                }
              }
            }
          }
        } catch (error) {
          console.error("AI enhancement failed, using original content:", error);
        }

        const article: InsertArticle = {
          slug: enhancedArticle.slug,
          imageUrl,
          imageAttribution,
          imageAuthor,
          imageAuthorUrl,
          sourceUrl,
          sourceName,
          categoryId,
          publishedAt,
          isBreaking: "false",
          isFeatured: "false"
        };
        
        // Store article with translations for processing
        articles.push({ 
          articleData: article, 
          translations: aiTranslations 
        });
      }
      
      return articles;
      
    } catch (error) {
      console.error(`Error parsing RSS feed ${feedUrl}:`, error);
      return [];
    }
  }

  async fetchAllFeeds(): Promise<void> {
    const feeds = await storage.getActiveRssFeeds();
    
    for (const feed of feeds) {
      try {
        console.log(`Fetching RSS feed: ${feed.name}`);
        const articles = await this.parseFeed(feed.url, feed.categoryId, feed.name);
        
        for (const articleWithTranslations of articles) {
          const { articleData, translations } = articleWithTranslations;
          const createdArticle = await storage.createArticle(articleData);
          
          // Create multilingual translations if AI generated them
          if (translations) {
            try {
              // Uzbek translation
              await storage.createArticleTranslation({
                articleId: createdArticle.id,
                languageCode: 'uz',
                title: translations.uz.title,
                description: translations.uz.description,
                content: translations.uz.content
              });
              
              // Russian translation
              await storage.createArticleTranslation({
                articleId: createdArticle.id,
                languageCode: 'ru',
                title: translations.ru.title,
                description: translations.ru.description,
                content: translations.ru.content
              });
              
              // English translation
              await storage.createArticleTranslation({
                articleId: createdArticle.id,
                languageCode: 'en',
                title: translations.en.title,
                description: translations.en.description,
                content: translations.en.content
              });
              
              console.log(`Created multilingual translations for article: ${createdArticle.id}`);
            } catch (error) {
              console.error(`Failed to create translations for article ${createdArticle.id}:`, error);
            }
          }
          
          // Telegram kanaliga yuborish
          try {
            const fullArticle = await storage.getArticleById(createdArticle.id);
            if (fullArticle) {
              await telegramBot.sendArticle(fullArticle);
              
              // Agar breaking news bo'lsa, alohida yuborish
              if (fullArticle.isBreaking === "true") {
                await telegramBot.sendBreakingNews(fullArticle);
              }
            }
          } catch (error) {
            console.error(`Telegram'ga yuborishda xatolik: ${error}`);
          }
        }
        
        await storage.updateRssFeedLastFetched(feed.id);
        console.log(`Successfully processed ${articles.length} articles from ${feed.name}`);
        
      } catch (error) {
        console.error(`Failed to process RSS feed ${feed.name}:`, error);
      }
    }
  }
}

export const rssParser = new RssParser();
