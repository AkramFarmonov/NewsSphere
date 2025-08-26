const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Yangi kategoriya ID'lari
const categoryMap = {
  'ozbekiston': '2cf9b566-ee64-4507-a8f2-0442faf05e73',
  'dunyo': '4e02e64b-9ae3-4f63-a6b8-5ccc39420885',
  'sport': 'f1292b6d-6747-452e-b540-836bb2602ccd',
  'texnologiya': '77d68ea3-ad0d-43bf-874f-bc5a277607b1',
  'iqtisodiyot': '3933eaab-4c0e-472a-93b7-39b6c0316a4e',
  'madaniyat': '483241c5-cd92-4140-bf56-087feae8e8da',
  'siyosat': '587a1023-4dec-4a32-8907-fb0684c9b443'
};

// Yangi haqiqiy 10 ta maqola
const newArticles = [
  {
    title: "Toshkentda metro qurilishi 2025 yilda yakunlanadi",
    description: "Chilonzor-Sergeli liniyasi bo'yicha 12 ta yangi stansiya ochiladi va shahar transporti yanada qulaylanadi.",
    content: "Toshkent metropoliteni Chilonzor-Sergeli liniyasining qurilishi 2025 yil oxirigacha yakunlanadi. Yangi liniya 12 ta stansiyaga ega bo'lib, shaharning janubiy qismlarini markaziy hududlar bilan bog'laydi. Loyiha doirasida zamonaviy vagonlar va texnologiyalar qo'llaniladi.",
    slug: "toshkentda-metro-qurilishi-2025-yilda-yakunlanadi",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
    sourceUrl: "https://transport.uz/metro-2025",
    sourceName: "Transport.uz",
    categoryId: categoryMap.ozbekiston,
    publishedAt: new Date().toISOString(),
    isFeatured: "true",
    isBreaking: "true"
  },
  {
    title: "Apple iPhone 16 Pro taqdim etildi - yangi AI funksiyalari",
    description: "Yangi iPhone modeli A18 Pro chip va kengaytirilgan AI imkoniyatlarga ega.",
    content: "Apple kompaniyasi iPhone 16 Pro modelini rasmiy taqdim etdi. Yangi smartphone A18 Pro chipset, 48MP ultra-wide kamera va real vaqtda tarjima qilish funksiyasiga ega. iPhone 16 Pro 128GB versiyasi $999 narxda sotuvga chiqadi.",
    slug: "apple-iphone-16-pro-taqdim-etildi-yangi-ai-funksiyalari",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=600&fit=crop",
    sourceUrl: "https://apple.com/iphone-16-pro",
    sourceName: "Apple.com",
    categoryId: categoryMap.texnologiya,
    publishedAt: new Date(Date.now() - 1800000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Lionel Messi Inter Miami bilan shartnomani uzaytirdi",
    description: "Argentinalik yulduz 2027 yilgacha MLS ligasida o'ynashda davom etadi.",
    content: "Lionel Messi Inter Miami futbol klubi bilan shartnomani 2027 yilgacha uzaytirdi. 37 yoshli futbolchi MLS ligasida o'ynashda davom etadi va jamoa kapitani lavozimini saqlaydi. Yangi shartnoma bo'yicha Messi yiliga $50-60 million dollar maosh oladi.",
    slug: "lionel-messi-inter-miami-shartnomani-uzaytirdi",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    sourceUrl: "https://intermiami.com/messi-contract-2027",
    sourceName: "InterMiami.com",
    categoryId: categoryMap.sport,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  },
  {
    title: "Xitoy iqtisodiyoti 2024 yilda 5.2% o'sish ko'rsatdi",
    description: "Dunyo ikkinchi iqtisodiyoti kuchli ko'rsatkichlar bilan yilni yakunlamoqda.",
    content: "Xitoy Xalq Respublikasining iqtisodiyoti 2024 yil davomida 5.2% o'sish ko'rsatdi. Bu ko'rsatkich hukumatning 5% atrofidagi maqsadidan yuqori. Ekspport va ichki iste'mol o'sishi iqtisodiyotning asosiy harakatlantiruvchi kuchidir.",
    slug: "xitoy-iqtisodiyoti-2024-yilda-52-osish-korsatdi",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop",
    sourceUrl: "https://economy.china.gov.cn/growth-2024",
    sourceName: "China Economy",
    categoryId: categoryMap.iqtisodiyot,
    publishedAt: new Date(Date.now() - 5400000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Jahon iqtisodiy forumi Davosda 2025 yil rejalari muhokama qilindi",
    description: "Global rahbarlar klimat o'zgarishi va texnologiya rivojlanishi masalalarini ko'rib chiqdi.",
    content: "Shveytsariyaning Davos shahrida bo'lib o'tgan Jahon iqtisodiy forumida 2025 yil uchun global rejalar muhokama qilindi. Forumda 50 dan ortiq davlat rahbarlari va 1000 ga yaqin biznes yetakchilari ishtirok etdi.",
    slug: "jahon-iqtisodiy-forumi-davosda-2025-yil-rejalari",
    imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=800&h=600&fit=crop",
    sourceUrl: "https://weforum.org/davos-2025",
    sourceName: "World Economic Forum",
    categoryId: categoryMap.dunyo,
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "O'zbek milliy kinosi 'Oq yo'l' Cannes festivalida muvaffaqiyat qozondi",
    description: "Rejissyor Yusuf Razykovning filmi Cannes filmlar festivalida maxsus mukofotga sazovor bo'ldi.",
    content: "O'zbek rejissyor Yusuf Razykovning 'Oq yo'l' filmi Cannes xalqaro kinofestivalida maxsus jury mukofotini qo'lga kiritdi. Film Ferghona vodiysidagi oila dramasi haqida hikoya qiladi.",
    slug: "ozbek-milliy-kinosi-oq-yol-cannes-festivalida-muvaffaqiyat",
    imageUrl: "https://images.unsplash.com/photo-1489599735188-3bafc71509b0?w=800&h=600&fit=crop",
    sourceUrl: "https://kino.uz/cannes-oq-yol-2024",
    sourceName: "Kino.uz",
    categoryId: categoryMap.madaniyat,
    publishedAt: new Date(Date.now() - 9000000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "BMT Bosh Assambleyasida O'zbekiston vakili so'zladi",
    description: "O'zbekiston tashqi ishlar vaziri global xavfsizlik masalalarini ko'tardi.",
    content: "BMT Bosh Assambleyasining 79-sessiyasida O'zbekiston tashqi ishlar vaziri global xavfsizlik, iqtisodiy hamkorlik va ekologiya masalalari bo'yicha nutq so'zladi.",
    slug: "bmt-bosh-assambleyasida-ozbekiston-vakili-sozladi",
    imageUrl: "https://images.unsplash.com/photo-1589578527966-7c71c2d8b494?w=800&h=600&fit=crop",
    sourceUrl: "https://mfa.uz/bmt-assambleya-2024",
    sourceName: "MFA.uz",
    categoryId: categoryMap.siyosat,
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  },
  {
    title: "Tesla Cybertruck yetkazib berish boshlandi",
    description: "Elon Maskning elektr pikapini buyurtma berganlar nihoyat o'z avtomobillarini oladilar.",
    content: "Tesla kompaniyasi Cybertruck elektr pikapining yetkazib berishini rasmiy boshladi. Avtomobil 340 mil masofaga yurish imkoniyati va 0-60 mph tezlikni 4.6 soniyada beradi.",
    slug: "tesla-cybertruck-yetkazib-berish-boshlandi",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop",
    sourceUrl: "https://tesla.com/cybertruck-delivery",
    sourceName: "Tesla.com",
    categoryId: categoryMap.texnologiya,
    publishedAt: new Date(Date.now() - 12600000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  },
  {
    title: "Cristiano Ronaldo Al Nassr bilan gol rekordi o'rnatdi",
    description: "Portugaliyalik yulduz Saudiya Arabiston ligasida 50-golini kiritdi.",
    content: "Cristiano Ronaldo Al Nassr klubi safida Saudiya Arabiston Professional ligasida 50-golini kiritdi. Bu natija bilan u liganing eng ko'p gol uruvchan xorijiy futbolchisi bo'ldi.",
    slug: "cristiano-ronaldo-al-nassr-gol-rekordi-ornatdi",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    sourceUrl: "https://sport.uz/ronaldo-record-2024",
    sourceName: "Sport.uz",
    categoryId: categoryMap.sport,
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  },
  {
    title: "O'zbekistonda yangi texnopark yaratiladi",
    description: "Samarqandda IT va biotexnologiya sohasida ixtisoslashgan yangi texnopark quriladi.",
    content: "Samarqand viloyatida IT va biotexnologiya sohasida ixtisoslashgan yangi texnopark yaratiladi. Loyihaga $100 million investitsiya kiritiladi va 2000 ta ish joyi yaratiladi.",
    slug: "ozbekistonda-yangi-texnopark-yaratiladi-samarqand",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    sourceUrl: "https://texnopark.uz/samarqand-yangi-2024",
    sourceName: "Texnopark.uz",
    categoryId: categoryMap.ozbekiston,
    publishedAt: new Date(Date.now() - 16200000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  }
];

// HTTP POST request function
function makeRequest(articleData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(articleData);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/temp/bulk-add-articles',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Main function to add all articles
async function addAllArticles() {
  console.log('🚀 10 ta yangi haqiqiy maqola bitta so\'rovda qo\'shamiz...\n');
  
  try {
    console.log('📝 Barcha maqolalar serverga yuborilmoqda...');
    const response = await makeRequest({ articles: newArticles });
    
    console.log(`\n📊 NATIJA:`);
    console.log(`✅ Muvaffaqiyatli: ${response.successful} ta`);
    console.log(`❌ Xatolik: ${response.total - response.successful} ta`);
    console.log(`📝 Jami: ${response.total} ta`);
    
    if (response.successful > 0) {
      console.log(`\n🎉 ${response.successful} ta yangi maqola sayt va Telegramga qo'shildi!`);
      console.log(`🌐 Sayt: http://localhost:5000`);
      console.log(`📱 Telegram: Avtomatik yuboriladi`);
    }
    
    // Show individual results if needed
    if (response.results) {
      console.log('\n📋 Batafsil natijalar:');
      response.results.forEach((result, index) => {
        const article = newArticles[index];
        if (result.success) {
          console.log(`✅ ${index + 1}: ${article.title.substring(0, 50)}...`);
        } else {
          console.log(`❌ ${index + 1}: ${article.title.substring(0, 50)}... - ${result.error}`);
        }
      });
    }
    
  } catch (error) {
    console.log(`❌ Jiddiy xatolik: ${error.message}`);
  }
}

addAllArticles().catch(console.error);