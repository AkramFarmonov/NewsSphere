import { GoogleGenAI } from "@google/genai";
import type { Article, Category } from "@shared/schema";

// AI orqali yangilik generatsiyasi uchun yaxshilangan xizmat
export class AINewsGenerator {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. AI features will be disabled.");
      return;
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  private checkApiKey(): boolean {
    return !!process.env.GEMINI_API_KEY && !!this.ai;
  }

  // RSS maqolasini o'zbek tiliga tarjima qilish va qayta yozish (YAXSHILANGAN)
  async translateAndRewriteArticle(
    originalTitle: string,
    originalContent: string,
    category: Category
  ): Promise<{ title: string; description: string; content: string; slug: string; imageKeywords: string[]; tags: string[] }> {
    if (!this.checkApiKey()) {
      throw new Error("Gemini API key not configured");
    }
    
    try {
      // Kalit so'zlarni asl matndan ajratib olish
      const keywordsFromTitle = this.extractKeywordsFromText(`${originalTitle} ${category.name}`);
      
      const prompt = `
Sen yuqori malakali o'zbek jurnalisti va SEO-mutaxassisasan. Sening vazifang - quyida berilgan ingliz tilidagi matndan foydalanib, O'zbekiston auditoriyasi uchun qiziqarli, o'qishli va SEO'ga optimallashtirilgan, kamida 350-400 so'zdan iborat to'liq maqola yozish.

Maqolaning strukturasi quyidagicha bo'lishi shart:
1. Qiziqarli Kirish Qismi: O'quvchini jalb qiladigan kirish.
2. Asosiy Qism: Mavzuni to'liq yoritib beruvchi, kamida 2-3 ta alohida sarlavhali bo'limlar.
3. Xulosa: Mavzuni yakunlovchi qisqa xulosa.

Maqola davomida [${keywordsFromTitle.join(', ')}] ro'yxatidagi so'zlarni tabiiy ravishda bir necha marta ishlating. Maqola uchun 5 ta mos teg yarating.

---
**FORMATLASH QOIDALARI (ENG MUHIM):**
- Javobingda HECH QANDAY Markdown formatlash belgilarini (**, #, *, -) ishlatma.
- Barcha matn formatlashsiz, toza holatda bo'lishi kerak.
- Sarlavhalarni ham ** belgisisiz, shunchaki yangi qatordan yoz.
---

Original matn:
"""
Sarlavha: ${originalTitle}
Matn: ${originalContent}
"""

Kalit so'zlar: ${keywordsFromTitle.join(', ')}

JSON formatida javob bering:
{
  "title": "O'zbek tilidagi sarlavha",
  "description": "Qisqacha tavsif 1-2 jumla",
  "content": "To'liq maqola matni o'zbek tilida",
  "tags": ["teg1", "teg2", "teg3", "teg4", "teg5"],
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

VA ENG OXIRIDA, imageKeywords qismida ushbu maqola uchun Unsplash'da rasm qidirishga mos keladigan 5 ta ingliz tilidagi kalit so'zni bering.
Masalan: ["artificial intelligence", "future technology", "data processing", "neural network", "innovation"]
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              imageKeywords: { type: "array", items: { type: "string" } }
            },
            required: ["title", "description", "content", "tags", "imageKeywords"]
          }
        },
        contents: prompt
      });

      let result = JSON.parse(response.text || "{}");
      
      // Agar imageKeywords AI tomonidan berilmagan bo'lsa, fallback method
      if (!result.imageKeywords || result.imageKeywords.length === 0) {
        result.imageKeywords = this.extractImageKeywordsFromText(originalTitle, originalContent, category);
      }
      
      // Tags ham bo'lmasa, fallback
      if (!result.tags || result.tags.length === 0) {
        result.tags = this.generateFallbackTags(result.title, result.content);
      }
      
      // Slug yaratish
      const slug = this.createSlug(result.title);

      return {
        title: result.title,
        description: result.description,
        content: result.content,
        slug,
        imageKeywords: result.imageKeywords || [],
        tags: result.tags || []
      };
    } catch (error) {
      console.error("AI yangilik generatsiyasida xatolik:", error);
      throw new Error("Failed to generate news with AI");
    }
  }

  // Mavjud maqolani yangilash va yaxshilash
  async improveExistingArticle(article: Article): Promise<{ title: string; description: string; content: string }> {
    if (!this.checkApiKey()) {
      throw new Error("Gemini API key not configured");
    }
    
    try {
      const prompt = `
Siz professional o'zbek jurnalist sifatida quyidagi maqolani yaxshilang va yangilang.

Mavjud maqola:
Sarlavha: ${article.title}
Tavsif: ${article.description}
Matn: ${article.content}

Talablar:
1. Sarlavhani yanada qiziqarli va e'tiborni jalb qiluvchi qiling
2. Tavsifni mukammallashtiring
3. Maqola matnini boyitib, yanada ma'lumotli qiling
4. O'zbek tilining qoidalariga amal qiling
5. SEO uchun optimallashtiring
6. Jurnalistik uslubni saqlang

JSON formatida javob bering:
{
  "title": "Yaxshilangan sarlavha",
  "description": "Yaxshilangan tavsif",
  "content": "Yaxshilangan maqola matni"
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" }
            },
            required: ["title", "description", "content"]
          }
        },
        contents: prompt
      });

      const result = JSON.parse(response.text || "{}");
      
      return {
        title: result.title,
        description: result.description,
        content: result.content
      };
    } catch (error) {
      console.error("Maqolani yaxshilashda xatolik:", error);
      throw new Error("Failed to improve article with AI");
    }
  }

  // Kategoriya bo'yicha yangi maqola yaratish
  async generateOriginalArticle(category: Category): Promise<{ title: string; description: string; content: string; slug: string }> {
    if (!this.checkApiKey()) {
      throw new Error("Gemini API key not configured");
    }
    
    try {
      const prompt = `
Siz professional o'zbek jurnalist sifatida "${category.name}" kategoriyasi uchun yangi, original maqola yozing.

Talablar:
1. Haqiqiy va dolzarb mavzu bo'lsin
2. O'zbekiston yoki dunyo yangiliklariga bog'liq bo'lsin
3. To'liq ma'lumotli va qiziqarli bo'lsin
4. Professional jurnalistik uslubda yozing
5. SEO uchun optimallashtiring
6. 300-500 so'zlik maqola bo'lsin

JSON formatida javob bering:
{
  "title": "Maqola sarlavhasi",
  "description": "Qisqacha tavsif",
  "content": "To'liq maqola matni"
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" }
            },
            required: ["title", "description", "content"]
          }
        },
        contents: prompt
      });

      const result = JSON.parse(response.text || "{}");
      
      // Slug yaratish
      const slug = this.createSlug(result.title);

      return {
        title: result.title,
        description: result.description,
        content: result.content,
        slug
      };
    } catch (error) {
      console.error("Original maqola yaratishda xatolik:", error);
      throw new Error("Failed to generate original article with AI");
    }
  }

  // URL-friendly slug yaratish
  private createSlug(title: string): string {
    if (!title || typeof title !== 'string') {
      return 'untitled-' + Date.now();
    }
    
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Faqat harf, raqam va bo'sh joy
      .replace(/\s+/g, '-') // Bo'sh joylarni tire bilan almashtirish
      .replace(/-+/g, '-') // Bir nechta tireni bittaga qisqartirish
      .trim()
      .substring(0, 100); // Maksimal uzunlik
  }

  // Maqola uchun teglar generatsiya qilish
  async generateTags(title: string, content: string): Promise<string[]> {
    if (!this.checkApiKey()) {
      console.warn("Gemini API key not configured, returning empty tags");
      return [];
    }
    
    try {
      const prompt = `
Quyidagi maqola uchun teglar yarating:
Sarlavha: ${title}
Matn: ${content}

5-10 ta tegni o'zbek tilida bering. Teglar qisqa va aniq bo'lsin.
JSON array formatida javob bering: ["teg1", "teg2", "teg3", ...]
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: { type: "string" }
          }
        },
        contents: prompt
      });

      const tags = JSON.parse(response.text || "[]");
      return tags.slice(0, 10); // Maksimal 10 ta teg
    } catch (error) {
      console.error("Teglar yaratishda xatolik:", error);
      return [];
    }
  }

  // YAXSHILANGAN: Matndan kalit so'zlar ajratib olish
  private extractKeywordsFromText(text: string): string[] {
    // O'zbek tilida muhim so'zlarni ajratib olish
    const commonWords = ["va", "uchun", "bilan", "da", "ga", "ni", "ning", "dan", "bo'yicha", "haqida", "yilda", "yangi", "katta", "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .slice(0, 5);

    return words;
  }

  // Rasm qidirish uchun kalit so'zlar generatsiya qilish (FALLBACK)
  private extractImageKeywordsFromText(title: string, content: string, category: Category): string[] {
    // Translation mapping for better English search results
    const translations: Record<string, string> = {
      "texnologiya": "technology",
      "sun'iy": "artificial",
      "intellekt": "intelligence",
      "sport": "sports",
      "chempionat": "championship",
      "o'zbek": "uzbek",
      "jahon": "world",
      "iqtisodiyot": "economy",
      "madaniyat": "culture",
      "festival": "festival",
      "park": "building",
      "siyosat": "politics",
      "o'zbekiston": "uzbekistan"
    };

    const titleWords = this.extractKeywordsFromText(title);
    const categoryWords = this.extractKeywordsFromText(category.name);
    
    const allWords = [...titleWords, ...categoryWords]
      .map(word => translations[word] || word)
      .slice(0, 5);

    // Kategoriya bo'yicha default keywords
    const categoryDefaults: Record<string, string[]> = {
      "Texnologiya": ["technology", "innovation", "digital", "computer", "artificial intelligence"],
      "Sport": ["sports", "athlete", "competition", "training", "stadium"],
      "Iqtisodiyot": ["business", "economy", "finance", "market", "investment"],
      "Madaniyat": ["culture", "traditional", "art", "festival", "heritage"],
      "O'zbekiston": ["uzbekistan", "tashkent", "building", "development", "architecture"],
      "Dunyo": ["world", "global", "international", "news", "countries"],
      "Siyosat": ["politics", "government", "leadership", "meeting", "policy"]
    };

    const defaults = categoryDefaults[category.name] || ["news", "information", "article", "story", "update"];
    
    return allWords.length > 0 ? allWords : defaults;
  }

  // Fallback tags generatsiya qilish
  private generateFallbackTags(title: string, content: string): string[] {
    const keywords = this.extractKeywordsFromText(`${title} ${content}`);
    const baseTags = ["yangilik", "ma'lumot", "dolzarb"];
    
    return [...keywords.slice(0, 3), ...baseTags].slice(0, 5);
  }
}

let aiGenerator: AINewsGenerator | null = null;

try {
  aiGenerator = new AINewsGenerator();
} catch (error) {
  console.warn("AI Generator initialization failed:", error);
}

export { aiGenerator };