import { GoogleGenAI } from "@google/genai";
import type { Article, Category } from "@shared/schema";

// AI orqali yangilik generatsiyasi uchun xizmat
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

  // RSS maqolasini o'zbek tiliga tarjima qilish va qayta yozish
  async translateAndRewriteArticle(
    originalTitle: string,
    originalContent: string,
    category: Category
  ): Promise<{ title: string; description: string; content: string; slug: string }> {
    if (!this.checkApiKey()) {
      throw new Error("Gemini API key not configured");
    }
    
    try {
      const prompt = `
Siz professional o'zbek jurnalist va tarjimon sifatida ishlaysiz. 
Quyidagi xorijiy yangilik maqolasini to'liq o'zbek tiliga tarjima qiling va o'zbek ommasi uchun qayta yozing.

Kategoriya: ${category.name}
Asl sarlavha: ${originalTitle}
Asl matn: ${originalContent}

Talablar:
1. Sarlavhani to'liq o'zbek tiliga tarjima qiling (qisqa va aniq bo'lsin)
2. Qisqacha tavsif yozing (1-2 jumla)
3. Maqola matnini to'liq tarjima qiling va o'zbek ommasi uchun tushunarli qilib yozing
4. O'zbek tilining qoidalariga amal qiling
5. Jurnalistik uslubda yozing
6. Faktlarni saqlab qoling, lekin o'zbek ommasi uchun tushunarli qiling

JSON formatida javob bering:
{
  "title": "O'zbek tilidagi sarlavha",
  "description": "Qisqacha tavsif 1-2 jumla",
  "content": "To'liq maqola matni o'zbek tilida"
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
}

let aiGenerator: AINewsGenerator | null = null;

try {
  aiGenerator = new AINewsGenerator();
} catch (error) {
  console.warn("AI Generator initialization failed:", error);
}

export { aiGenerator };