import { z } from "zod";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.warn("UNSPLASH_ACCESS_KEY not found. Image fetching will be disabled.");
}

interface UnsplashPhoto {
  id: string;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export class UnsplashService {
  private readonly baseUrl = "https://api.unsplash.com";
  private readonly accessKey: string;

  constructor() {
    this.accessKey = UNSPLASH_ACCESS_KEY || "";
  }

  private getHeaders() {
    return {
      "Authorization": `Client-ID ${this.accessKey}`,
      "Accept-Version": "v1"
    };
  }

  /**
   * Search for images based on a query string
   */
  async searchPhotos(query: string, count: number = 1): Promise<UnsplashPhoto[]> {
    if (!this.accessKey) {
      console.warn("Unsplash API key not configured");
      return [];
    }

    try {
      const url = new URL(`${this.baseUrl}/search/photos`);
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", count.toString());
      url.searchParams.set("orientation", "landscape");
      url.searchParams.set("content_filter", "high");

      const response = await fetch(url.toString(), {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: UnsplashSearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching from Unsplash:", error);
      return [];
    }
  }

  /**
   * Get image URL for an article based on its title and category
   */
  async getArticleImage(title: string, category: string): Promise<string | null> {
    // Create search queries in order of preference
    const searchQueries = [
      `${category} news`,
      category,
      this.extractKeywords(title),
      "news"
    ].filter(query => query.length > 0);

    for (const query of searchQueries) {
      const photos = await this.searchPhotos(query, 1);
      if (photos.length > 0) {
        return photos[0].urls.regular;
      }
    }

    return null;
  }

  /**
   * Extract keywords from article title for better image matching
   */
  private extractKeywords(title: string): string {
    // Remove common Uzbek words and extract meaningful keywords
    const commonWords = ["va", "uchun", "bilan", "da", "ga", "ni", "ning", "dan", "bo'yicha", "haqida"];
    const words = title.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .slice(0, 3); // Take first 3 meaningful words

    return words.join(" ");
  }

  /**
   * Get category-specific image for fallback
   */
  async getCategoryImage(categorySlug: string): Promise<string | null> {
    const categoryMappings: Record<string, string> = {
      "ozbekiston": "uzbekistan flag architecture",
      "dunyo": "world global news",
      "sport": "sports athlete competition",
      "texnologiya": "technology innovation computer",
      "iqtisodiyot": "business economy finance",
      "madaniyat": "culture art traditional",
      "siyosat": "politics government building"
    };

    const searchQuery = categoryMappings[categorySlug] || categorySlug;
    const photos = await this.searchPhotos(searchQuery, 1);
    
    return photos.length > 0 ? photos[0].urls.regular : null;
  }
}

export const unsplashService = new UnsplashService();