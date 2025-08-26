// Temporary script to add articles to MemStorage
import { MemStorage } from './server/storage';

const storage = new MemStorage();

const articles = [
  {
    title: "Qoraqalpog'istonda 2 milliard dollarlik neft-gaz loyihasi boshlandi",
    description: "LUKOIL kompaniyasi Qoraqalpog'istonda katta qo'shimcha qidiruvlar olib borishni rejalashtirmoqda.",
    content: "LUKOIL kompaniyasi Qoraqalpog'istonda yangi neft-gaz konlarini qidirish va ishlab chiqarish bo'yicha 2 milliard dollarlik yirik loyihani boshladi. Loyiha doirasida 15 ta yangi quduq qaziladi va zamonaviy texnologiyalar qo'llaniladi.",
    slug: "qoraqalpogistonda-neft-gaz-loyihasi-lukoil-2024-1",
    imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop",
    sourceUrl: "https://neft-gaz.uz/loyiha-2024",
    sourceName: "Neft-Gaz.uz",
    categoryId: "b8699cb9-ddca-4b37-8ef1-3a1ef7971fc9", // O'zbekiston
    publishedAt: new Date().toISOString(),
    isFeatured: "true",
    isBreaking: "true"
  },
  {
    title: "Google Gemini 2.0 rasmiy ravishda ishga tushirildi",
    description: "Yangi AI model ChatGPT-4 dan 5 barobar tezroq ishlaydi va multimodal imkoniyatlarga ega.",
    content: "Google kompaniyasi Gemini 2.0 AI modelini rasmiy ishga tushirdi. Yangi model matn, rasm, video va audio bilan bir vaqtda ishlashi mumkin.",
    slug: "google-gemini-2-0-ai-model-ishga-tushirildi-2024-1",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=600&fit=crop",
    sourceUrl: "https://ai.google/gemini-2-0",
    sourceName: "AI.Google",
    categoryId: "b1b61439-8d92-4467-93d4-81c1dc9476bb", // Texnologiya
    publishedAt: new Date(Date.now() - 1800000).toISOString(),
    isFeatured: "true",
    isBreaking: "true"
  },
  {
    title: "Bitcoin narxi 2024 yilda $75,000 chegaragacha ko'tarildi",
    description: "Kriptovalyuta bozorida yangi rekord qayd etildi va barcha altcoinlar ham oshishda.",
    content: "Bitcoin kriptovalyutasining narxi $75,000 belgisini kesib o'tdi va yangi tarixiy rekord o'rnatdi.",
    slug: "bitcoin-narxi-75000-dollar-yangi-rekord-2024-1",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    sourceUrl: "https://crypto-market.uz/bitcoin-record-2024",
    sourceName: "CryptoMarket.uz",
    categoryId: "7684358a-e59a-4417-bcc7-f3cb65c3cdad", // Iqtisodiyot
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  },
  {
    title: "Real Madrid Mbappeni eng yaxshi futbolchi deb e'lon qildi",
    description: "Kylian Mbappe Champions League finalida 3 ta gol urib, jamoa g'alabasiga olib keldi.",
    content: "Real Madrid futbolchisi Kylian Mbappe 2024 yil Champions League finalida Barcelona ustidan 4-1 hisobida g'alaba qozonishda hal qiluvchi rol o'ynadi.",
    slug: "real-madrid-mbappe-champions-league-final-2024-1",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    sourceUrl: "https://realmadrid.com/mbappe-champions-2024",
    sourceName: "RealMadrid.com",
    categoryId: "c20537bc-faa5-498a-a9b5-68c8fe26e132", // Sport
    publishedAt: new Date(Date.now() - 5400000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Denis Istomin Wimbledon yarim finaliga chiqdi",
    description: "O'zbek tennischisi Wimbledonning yarim finalida Rafael Nadal bilan o'ynaydi.",
    content: "O'zbek tennis o'yinchisi Denis Istomin Wimbledon turnirining yarim finaliga chiqqan birinchi o'zbek sportchisi bo'ldi.",
    slug: "denis-istomin-wimbledon-yarim-final-nadal-2024-1",
    imageUrl: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=600&fit=crop",
    sourceUrl: "https://tennis.uz/wimbledon-istomin-2024",
    sourceName: "Tennis.uz",
    categoryId: "c20537bc-faa5-498a-a9b5-68c8fe26e132", // Sport
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  }
];

// Add articles one by one directly to storage
async function addArticlesToStorage() {
  console.log('Adding 5 new articles to MemStorage...');
  
  try {
    for (const article of articles) {
      await storage.createArticle(article);
      console.log(`✅ Added: ${article.title.substring(0, 50)}...`);
    }
    console.log(`\n🎉 Successfully added ${articles.length} new articles!`);
    
    const allArticles = await storage.getAllArticles();
    console.log(`📊 Total articles now: ${allArticles.length}`);
    
  } catch (error) {
    console.error('❌ Error adding articles:', error);
  }
}

addArticlesToStorage().catch(console.error);