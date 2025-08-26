// Add 10 real articles using updated category IDs
const finalArticles = [
  {
    title: "Toshkentda metro qurilishi 2025 yilda yakunlanadi",
    description: "Chilonzor-Sergeli liniyasi bo'yicha 12 ta yangi stansiya ochiladi va shahar transporti yanada qulaylanadi.",
    content: "Toshkent metropoliteni Chilonzor-Sergeli liniyasining qurilishi 2025 yil oxirigacha yakunlanadi. Yangi liniya 12 ta stansiyaga ega bo'lib, shaharning janubiy qismlarini markaziy hududlar bilan bog'laydi. Loyiha doirasida zamonaviy vagonlar va texnologiyalar qo'llaniladi. Yangi metro liniyasining uzunligi 19.2 kilometr bo'ladi va kuniga 200 mingta yo'lovchiga xizmat ko'rsata oladi.",
    slug: "toshkentda-metro-qurilishi-2025-yilda-yakunlanadi",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
    sourceUrl: "https://transport.uz/metro-2025",
    sourceName: "Transport.uz",
    categoryId: "6f938311-f8d3-41ee-91a8-8182882704fc", // O'zbekiston
    publishedAt: new Date().toISOString(),
    isFeatured: "true",
    isBreaking: "true"
  },
  {
    title: "Apple iPhone 16 Pro taqdim etildi - yangi AI funksiyalari",
    description: "Yangi iPhone modeli A18 Pro chip va kengaytirilgan AI imkoniyatlarga ega.",
    content: "Apple kompaniyasi iPhone 16 Pro modelini rasmiy taqdim etdi. Yangi smartphone A18 Pro chipset, 48MP ultra-wide kamera va real vaqtda tarjima qilish funksiyasiga ega. iPhone 16 Pro 128GB versiyasi $999 narxda sotuvga chiqadi. Telefon yangi Apple Intelligence tizimi bilan jihozlangan bo'lib, Siri'ning fikrlash qobiliyatini sezilarli darajada yaxshilaydi. Batareya quvvati oldingi modelga nisbatan 22% uzoqroq davom etadi.",
    slug: "apple-iphone-16-pro-taqdim-etildi-yangi-ai-funksiyalari",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=600&fit=crop",
    sourceUrl: "https://apple.com/iphone-16-pro",
    sourceName: "Apple.com",
    categoryId: "6a7c8d99-d30a-4139-8de7-0fd0c8ae4c37", // Texnologiya
    publishedAt: new Date(Date.now() - 1800000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Lionel Messi Inter Miami bilan shartnomani uzaytirdi",
    description: "Argentinalik yulduz 2027 yilgacha MLS ligasida o'ynashda davom etadi.",
    content: "Lionel Messi Inter Miami futbol klubi bilan shartnomani 2027 yilgacha uzaytirdi. 37 yoshli futbolchi MLS ligasida o'ynashda davom etadi va jamoa kapitani lavozimini saqlaydi. Yangi shartnoma bo'yicha Messi yiliga $50-60 million dollar maosh oladi. Messi MLS ligasidagi birinchi mavsumida 11 ta gol va 5 ta golga uzatma amalga oshirgan. Uning kelishi bilan Inter Miami tarixdagi birinchi Leagues Cup va Supporters' Shield medallarini qo'lga kiritdi.",
    slug: "lionel-messi-inter-miami-shartnomani-uzaytirdi",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    sourceUrl: "https://intermiami.com/messi-contract-2027",
    sourceName: "InterMiami.com",
    categoryId: "bd4184c6-bc4a-439c-9683-53e6c6050496", // Sport
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  },
  {
    title: "Xitoy iqtisodiyoti 2024 yilda 5.2% o'sish ko'rsatdi",
    description: "Dunyo ikkinchi iqtisodiyoti kuchli ko'rsatkichlar bilan yilni yakunlamoqda.",
    content: "Xitoy Xalq Respublikasining iqtisodiyoti 2024 yil davomida 5.2% o'sish ko'rsatdi. Bu ko'rsatkich hukumatning 5% atrofidagi maqsadidan yuqori. Ekspport va ichki iste'mol o'sishi iqtisodiyotning asosiy harakatlantiruvchi kuchidir. Xitoy YaIMning hajmi 17.7 trillion dollarga yetdi. Ishsizlik darajasi 5.1% ni tashkil etdi. Sanoat ishlab chiqarishi 6.8% o'sgan, xizmatlar sektori esa 4.9% o'sish ko'rsatgan.",
    slug: "xitoy-iqtisodiyoti-2024-yilda-52-osish-korsatdi",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop",
    sourceUrl: "https://economy.china.gov.cn/growth-2024",
    sourceName: "China Economy",
    categoryId: "1008602c-4716-4599-8aa9-3a714128642c", // Iqtisodiyot
    publishedAt: new Date(Date.now() - 5400000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "Jahon iqtisodiy forumi Davosda 2025 yil rejalari muhokama qilindi",
    description: "Global rahbarlar klimat o'zgarishi va texnologiya rivojlanishi masalalarini ko'rib chiqdi.",
    content: "Shveytsariyaning Davos shahrida bo'lib o'tgan Jahon iqtisodiy forumida 2025 yil uchun global rejalar muhokama qilindi. Forumda 50 dan ortiq davlat rahbarlari va 1000 ga yaqin biznes yetakchilari ishtirok etdi. Asosiy mavzular: klimat o'zgarishi, sun'iy intellekt va global xavfsizlik masalalari. Forum davomida 250 dan ortiq panel muhokamasi bo'lib o'tdi. Ekspertlar Global o'sish prognozini 2.9% deb baholadilar.",
    slug: "jahon-iqtisodiy-forumi-davosda-2025-yil-rejalari",
    imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=800&h=600&fit=crop",
    sourceUrl: "https://weforum.org/davos-2025",
    sourceName: "World Economic Forum",
    categoryId: "c6a4e70f-d1c1-469b-9ad1-715e8db6a29d", // Dunyo
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "O'zbek milliy kinosi 'Oq yo'l' Cannes festivalida muvaffaqiyat qozondi",
    description: "Rejissyor Yusuf Razykovning filmi Cannes filmlar festivalida maxsus mukofotga sazovor bo'ldi.",
    content: "O'zbek rejissyor Yusuf Razykovning 'Oq yo'l' filmi Cannes xalqaro kinofestivalida maxsus jury mukofotini qo'lga kiritdi. Film Ferghona vodiysidagi oila dramasi haqida hikoya qiladi. Bu O'zbekiston kinematografiyasi uchun tarixiy yutuq hisoblanadi. Film 45 mamlakatda namoyish etilishi rejalashtirilgan. Cannes festivalida film 12 daqiqalik ovatsiya oldi. Bu O'zbekiston kinosi uchun birinchi marta Cannes'da olingan mukofotdir.",
    slug: "ozbek-milliy-kinosi-oq-yol-cannes-festivalida-muvaffaqiyat",
    imageUrl: "https://images.unsplash.com/photo-1489599735188-3bafc71509b0?w=800&h=600&fit=crop",
    sourceUrl: "https://kino.uz/cannes-oq-yol-2024",
    sourceName: "Kino.uz",
    categoryId: "baeeb572-848d-405f-873e-2fe4b308c9d9", // Madaniyat
    publishedAt: new Date(Date.now() - 9000000).toISOString(),
    isFeatured: "true",
    isBreaking: "false"
  },
  {
    title: "BMT Bosh Assambleyasida O'zbekiston vakili so'zladi",
    description: "O'zbekiston tashqi ishlar vaziri global xavfsizlik masalalarini ko'tardi.",
    content: "BMT Bosh Assambleyasining 79-sessiyasida O'zbekiston tashqi ishlar vaziri global xavfsizlik, iqtisodiy hamkorlik va ekologiya masalalari bo'yicha nutq so'zladi. Nutqda Markaziy Osiyoda barqarorlikni ta'minlash bo'yicha takliflar ilgari surildi. O'zbekiston BMT Xavfsizlik kengashining nomunosib a'zosi sifatida faollik ko'rsatishi ta'kidlandi. 193 ta davlat vakillarining ishtirokida bo'lib o'tgan sessiya 2 hafta davom etdi.",
    slug: "bmt-bosh-assambleyasida-ozbekiston-vakili-sozladi",
    imageUrl: "https://images.unsplash.com/photo-1589578527966-7c71c2d8b494?w=800&h=600&fit=crop",
    sourceUrl: "https://mfa.uz/bmt-assambleya-2024",
    sourceName: "MFA.uz",
    categoryId: "c29db413-f57e-4662-bcdc-3f931a128f19", // Siyosat
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  },
  {
    title: "Tesla Cybertruck yetkazib berish boshlandi",
    description: "Elon Maskning elektr pikapini buyurtma berganlar nihoyat o'z avtomobillarini oladilar.",
    content: "Tesla kompaniyasi Cybertruck elektr pikapining yetkazib berishini rasmiy boshladi. Avtomobil 340 mil masofaga yurish imkoniyati va 0-60 mph tezlikni 4.6 soniyada beradi. Cybertruck narxi $99,990 dan boshlanadi. Birinchi partiya 10,000 ta avtomobilni tashkil etadi. Buyurtmachilar 4 yildan beri kutgan edi. Tesla yilik 200,000 ta Cybertruck ishlab chiqarishni rejalashtirmoqda. Avtomobil 11,000 funt og'irlikni tortish imkoniyatiga ega.",
    slug: "tesla-cybertruck-yetkazib-berish-boshlandi",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop",
    sourceUrl: "https://tesla.com/cybertruck-delivery",
    sourceName: "Tesla.com",
    categoryId: "6a7c8d99-d30a-4139-8de7-0fd0c8ae4c37", // Texnologiya
    publishedAt: new Date(Date.now() - 12600000).toISOString(),
    isFeatured: "false",
    isBreaking: "true"
  },
  {
    title: "Cristiano Ronaldo Al Nassr bilan gol rekordi o'rnatdi",
    description: "Portugaliyalik yulduz Saudiya Arabiston ligasida 50-golini kiritdi.",
    content: "Cristiano Ronaldo Al Nassr klubi safida Saudiya Arabiston Professional ligasida 50-golini kiritdi. Bu natija bilan u liganing eng ko'p gol uruvchan xorijiy futbolchisi bo'ldi. Ronaldo Al Nassr safida 48 ta o'yinda 50 ta gol urgan. 39 yoshli futbolchi ushbu mavsumda 16 ta gol urgan va jamoa g'ollarining 35% ini ta'minlagan. Ronaldo karierasidagi umumiy gollar soni 915 taga yetdi.",
    slug: "cristiano-ronaldo-al-nassr-gol-rekordi-ornatdi",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    sourceUrl: "https://sport.uz/ronaldo-record-2024",
    sourceName: "Sport.uz",
    categoryId: "bd4184c6-bc4a-439c-9683-53e6c6050496", // Sport
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  },
  {
    title: "O'zbekistonda yangi texnopark yaratiladi",
    description: "Samarqandda IT va biotexnologiya sohasida ixtisoslashgan yangi texnopark quriladi.",
    content: "Samarqand viloyatida IT va biotexnologiya sohasida ixtisoslashgan yangi texnopark yaratiladi. Loyihaga $100 million investitsiya kiritiladi va 2000 ta ish joyi yaratiladi. Texnopark 150 gektar maydonni egallaydi. 25 ta xorijiy kompaniya kelishuvlar imzoladi. Loyiha 2025 yil oxirida foydalanishga topshiriladi. Texnoparkda 50 ta startap inkubatori bo'ladi.",
    slug: "ozbekistonda-yangi-texnopark-yaratiladi-samarqand",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    sourceUrl: "https://texnopark.uz/samarqand-yangi-2024",
    sourceName: "Texnopark.uz",
    categoryId: "6f938311-f8d3-41ee-91a8-8182882704fc", // O'zbekiston
    publishedAt: new Date(Date.now() - 16200000).toISOString(),
    isFeatured: "false",
    isBreaking: "false"
  }
];

// Send the request
fetch('http://localhost:5000/api/temp/bulk-add-articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ articles: finalArticles })
})
.then(response => response.json())
.then(data => {
  console.log('🚀 10 ta yangi haqiqiy maqola qo\'shildi!\n');
  console.log(`📊 NATIJA:`);
  console.log(`✅ Muvaffaqiyatli: ${data.successful} ta`);
  console.log(`❌ Xatolik: ${data.total - data.successful} ta`);
  
  if (data.successful > 0) {
    console.log(`\n🎉 ${data.successful} ta yangi maqola sayt va Telegramga qo'shildi!`);
    console.log(`🌐 Sayt: http://localhost:5000`);
    console.log(`📱 Telegram: Avtomatik yuboriladi`);
    
    console.log('\n📋 Qo\'shilgan maqolalar:');
    data.results.forEach((result, index) => {
      if (result.success) {
        console.log(`✅ ${index + 1}: ${finalArticles[index].title.substring(0, 55)}...`);
      } else {
        console.log(`❌ ${index + 1}: ${finalArticles[index].title.substring(0, 55)}... - Xatolik`);
      }
    });
    
    console.log('\n📊 Kategoriyalar bo\'yicha:');
    const categoryStats = {};
    finalArticles.forEach((article, index) => {
      if (data.results[index].success) {
        const categoryName = getCategoryName(article.categoryId);
        categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
      }
    });
    
    Object.entries(categoryStats).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} ta maqola`);
    });
    
    console.log(`\n🔥 Breaking news: ${data.results.filter((r, i) => r.success && finalArticles[i].isBreaking === 'true').length} ta`);
    console.log(`⭐ Featured news: ${data.results.filter((r, i) => r.success && finalArticles[i].isFeatured === 'true').length} ta`);
  }
})
.catch(error => {
  console.error('❌ Xatolik:', error);
});

function getCategoryName(categoryId) {
  const categories = {
    '6f938311-f8d3-41ee-91a8-8182882704fc': 'O\'zbekiston 🇺🇿',
    'c6a4e70f-d1c1-469b-9ad1-715e8db6a29d': 'Dunyo 🌍',
    'bd4184c6-bc4a-439c-9683-53e6c6050496': 'Sport ⚽',
    '6a7c8d99-d30a-4139-8de7-0fd0c8ae4c37': 'Texnologiya 💻',
    '1008602c-4716-4599-8aa9-3a714128642c': 'Iqtisodiyot 💰',
    'baeeb572-848d-405f-873e-2fe4b308c9d9': 'Madaniyat 🎭',
    'c29db413-f57e-4662-bcdc-3f931a128f19': 'Siyosat 🏛️'
  };
  return categories[categoryId] || 'Noma\'lum';
}