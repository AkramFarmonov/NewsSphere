import { MemStorage } from './server/storage.js';

const storage = new MemStorage();

const newArticles = [
  {
    title: "Qoraqalpog'istonda 2 milliard dollarlik neft-gaz loyihasi boshlandi",
    description: "LUKOIL kompaniyasi Qoraqalpog'istonda katta qo'shimcha qidiruvlar olib borishni rejalashtirmoqda.",
    content: "LUKOIL kompaniyasi Qoraqalpog'istonda yangi neft-gaz konlarini qidirish va ishlab chiqarish bo'yicha 2 milliard dollarlik yirik loyihani boshladi. Loyiha doirasida 15 ta yangi quduq qaziladi va zamonaviy texnologiyalar qo'llaniladi. Bu loyiha O'zbekiston energetika mustaqilligini mustahkamlash va eksport salohiyatini oshirishga yo'naltirilgan.\n\nLoyiha 2024-2027 yillar oralig'ida amalga oshiriladi va 5000 ga yaqin ish joyi yaratadi. LUKOIL O'zbekistonning strategik sheriklaridan biri sifatida mamlakatning iqtisodiy rivojlanishiga katta hissa qo'shmoqda.",
    slug: "qoraqalpogistonda-neft-gaz-loyihasi-lukoil-2024",
    imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop",
    sourceUrl: "https://neft-gaz.uz/loyiha-2024",
    sourceName: "Neft-Gaz.uz",
    categoryId: "b8699cb9-ddca-4b37-8ef1-3a1ef7971fc9",
    publishedAt: "2024-08-26T19:15:00.000Z",
    isFeatured: "true",
    isBreaking: "true"
  },
  {
    title: "Yevropa Ittifoqi 2024 yilda yangi energetika strategiyasini e'lon qildi",
    description: "YeI mamlakatlarining energetika mustaqilligini ta'minlash uchun 300 milliard yevroli investitsiya dasturi tasdiqlandi.",
    content: "Yevropa Ittifoqi 2024-2030 yillar uchun yangi energetika strategiyasini e'lon qildi. Bu strategiya doirasida qayta tiklanadigan energiya manbalarini 80% gacha oshirish, energiya samaradorligini 40% yaxshilash va energetika mustaqilligini ta'minlash ko'zda tutilgan.\n\nDastur doirasida quyosh va shamol energetikasiga katta investitsiyalar kiritiladi. YeI rahbariyati 2030 yilgacha toza energiya bo'yicha global lidership pozitsiyasini egallashni maqsad qilib qo'ygan.",
    slug: "yevropa-ittifoqi-yangi-energetika-strategiyasi-2024",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
    sourceUrl: "https://europa.eu/energy-strategy-2024",
    sourceName: "Europa.eu",
    categoryId: "1cd89ac5-6af2-4936-b97a-c7aba2c8fdf7",
    publishedAt: "2024-08-26T18:45:00.000Z",
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Real Madrid Mbappeni 2024 yil uchun eng yaxshi futbolchi deb e'lon qildi",
    description: "Kylian Mbappe Champions League finalida 3 ta gol urib, jamoa g'alabasiga olib keldi.",
    content: "Real Madrid futbolchisi Kylian Mbappe 2024 yil Champions League finalida Barcelona ustidan 4-1 hisobida g'alaba qozonishda hal qiluvchi rol o'ynadi. Fransuz hujumchisi o'yinning 25, 67 va 89-daqiqalarida gol urdi.\n\nBu g'alaba bilan Real Madrid o'zining 16-chi Champions League kubogini qo'lga kiritdi. Mbappe klubga o'tganidan beri 45 ta o'yinda 52 ta gol urdi va La Liga'da ham to'p suri bo'yicha birinchi o'rinni egalladi.",
    slug: "real-madrid-mbappe-champions-league-final-2024",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    sourceUrl: "https://realmadrid.com/mbappe-champions-2024",
    sourceName: "RealMadrid.com",
    categoryId: "6cf7f7a7-e1d4-48ab-9a28-0fda4b3da4f5",
    publishedAt: "2024-08-26T18:30:00.000Z",
    isFeatured: "true",
    isBreaking: "false"
  }
];

async function seedNewArticles() {
  console.log("Starting to seed new articles...");
  
  try {
    for (const articleData of newArticles) {
      const article = await storage.createArticle(articleData);
      console.log(`✅ Created article: ${article.title.substring(0, 50)}...`);
    }
    
    console.log("\n🎉 Successfully added 3 new articles!");
    
    // Show current articles count
    const allArticles = await storage.getAllArticles();
    console.log(`📊 Total articles in database: ${allArticles.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding articles:", error);
  }
}

seedNewArticles();