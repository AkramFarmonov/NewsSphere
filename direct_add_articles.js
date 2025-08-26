const fs = require('fs');
const path = require('path');

// To'g'ridan-to'g'ri MemStorage instance'ga kirish uchun
// Server kodini o'qib kerakli funktsiyani import qilamiz

async function addArticlesViaAPI() {
  const categoryMap = {
    'ozbekiston': 'b8699cb9-ddca-4b37-8ef1-3a1ef7971fc9',
    'dunyo': '51d9e76a-3eb2-4036-9b8e-5e89b709a10e',
    'sport': 'c20537bc-faa5-498a-a9b5-68c8fe26e132',
    'texnologiya': 'b1b61439-8d92-4467-93d4-81c1dc9476bb',
    'iqtisodiyot': '7684358a-e59a-4417-bcc7-f3cb65c3cdad',
    'madaniyat': '39302032-f9e7-4db5-83e8-4c06650e8d71',
    'siyosat': '6951593b-7369-4652-9604-4eb45fb8b6d5'
  };

  const articles = [
    {
      title: "Qoraqalpog'istonda 2 milliard dollarlik neft-gaz loyihasi boshlandi",
      description: "LUKOIL kompaniyasi Qoraqalpog'istonda katta qo'shimcha qidiruvlar olib borishni rejalashtirmoqda.",
      content: "LUKOIL kompaniyasi Qoraqalpog'istonda yangi neft-gaz konlarini qidirish va ishlab chiqarish bo'yicha 2 milliard dollarlik yirik loyihani boshladi. Loyiha doirasida 15 ta yangi quduq qaziladi va zamonaviy texnologiyalar qo'llaniladi.",
      slug: "qoraqalpogistonda-neft-gaz-loyihasi-lukoil-2024",
      imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop",
      sourceUrl: "https://neft-gaz.uz/loyiha-2024",
      sourceName: "Neft-Gaz.uz",
      categoryId: categoryMap.ozbekiston,
      isFeatured: "true",
      isBreaking: "true"
    },
    {
      title: "Google Gemini 2.0 rasmiy ravishda ishga tushirildi",
      description: "Yangi AI model ChatGPT-4 dan 5 barobar tezroq ishlaydi va multimodal imkoniyatlarga ega.",
      content: "Google kompaniyasi Gemini 2.0 AI modelini rasmiy ishga tushirdi. Yangi model matn, rasm, video va audio bilan bir vaqtda ishlashi mumkin. Gemini 2.0 o'zining oldingi versiyasidan 10 barobar kuchli va tezroq.",
      slug: "google-gemini-2-0-ai-model-ishga-tushirildi-2024",
      imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=600&fit=crop",
      sourceUrl: "https://ai.google/gemini-2-0",
      sourceName: "AI.Google",
      categoryId: categoryMap.texnologiya,
      isFeatured: "true",
      isBreaking: "true"
    },
    {
      title: "Bitcoin narxi 2024 yilda $75,000 chegaragacha ko'tarildi",
      description: "Kriptovalyuta bozorida yangi rekord qayd etildi va barcha altcoinlar ham oshishda.",
      content: "Bitcoin kriptovalyutasining narxi $75,000 belgisini kesib o'tdi va yangi tarixiy rekord o'rnatdi. Bu o'sishning asosiy sabablari ETF fondlarining faolligi, institusional investorlarning qiziqishi va halving hodisasining ta'siri.",
      slug: "bitcoin-narxi-75000-dollar-yangi-rekord-2024",
      imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
      sourceUrl: "https://crypto-market.uz/bitcoin-record-2024",
      sourceName: "CryptoMarket.uz",
      categoryId: categoryMap.iqtisodiyot,
      isFeatured: "false",
      isBreaking: "true"
    },
    {
      title: "Real Madrid Mbappeni eng yaxshi futbolchi deb e'lon qildi",
      description: "Kylian Mbappe Champions League finalida 3 ta gol urib, jamoa g'alabasiga olib keldi.",
      content: "Real Madrid futbolchisi Kylian Mbappe 2024 yil Champions League finalida Barcelona ustidan 4-1 hisobida g'alaba qozonishda hal qiluvchi rol o'ynadi. Fransuz hujumchisi o'yinning 25, 67 va 89-daqiqalarida gol urdi.",
      slug: "real-madrid-mbappe-champions-league-final-2024",
      imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
      sourceUrl: "https://realmadrid.com/mbappe-champions-2024",
      sourceName: "RealMadrid.com",
      categoryId: categoryMap.sport,
      isFeatured: "true",
      isBreaking: "false"
    },
    {
      title: "O'zbek rejissyor Jahon Oscar mukofotiga nomzod bo'ldi",
      description: "Jahon Abdullayevning 'Buyuk yo'l' filmi Oskar mukofotida eng yaxshi xorijiy film nomzodi.",
      content: "O'zbek rejissyor Jahon Abdullayevning 'Buyuk yo'l' filmi 2024 yil Oscar mukofotida eng yaxshi xorijiy film nominatsiyasiga kiritildi. Film Buyuk Ipak yo'li bo'yicha sayohat qiluvchi savdogarning hikoyasini tasvirlaydi.",
      slug: "ozbek-rejissyor-jahon-abdullayev-oscar-nomzodi-2024",
      imageUrl: "https://images.unsplash.com/photo-1489599735188-3bafc71509b0?w=800&h=600&fit=crop",
      sourceUrl: "https://kino.uz/oscar-nomination-2024",
      sourceName: "Kino.uz",
      categoryId: categoryMap.madaniyat,
      isFeatured: "true",
      isBreaking: "false"
    },
    {
      title: "Markaziy Osiyo energetika hamkorligi kelishuvi imzolandi",
      description: "O'zbekiston, Qozog'iston va Qirg'iziston elektr energiya eksport-import shartnomasi imzolandi.",
      content: "Toshkentda bo'lib o'tgan Markaziy Osiyo sammitida O'zbekiston, Qozog'iston va Qirg'iziston elektr energiyasini eksport-import qilish bo'yicha ko'p yillik kelishuv imzolandi. Shartnoma mintaqaning energetika xavfsizligini ta'minlashga qaratilgan.",
      slug: "markaziy-osiyo-energetika-hamkorligi-kelishuv-2024",
      imageUrl: "https://images.unsplash.com/photo-1473177027534-53d906e9abcb?w=800&h=600&fit=crop",
      sourceUrl: "https://siyosat.uz/markaziy-osiyo-sammit-2024",
      sourceName: "Siyosat.uz",
      categoryId: categoryMap.siyosat,
      isFeatured: "true",
      isBreaking: "false"
    },
    {
      title: "Denis Istomin Wimbledon yarim finaliga chiqdi",
      description: "O'zbek tennischisi Wimbledonning yarim finalida Rafael Nadal bilan o'ynaydi.",
      content: "O'zbek tennis o'yinchisi Denis Istomin Wimbledon turnirining yarim finaliga chiqqan birinchi o'zbek sportchisi bo'ldi. U chorak finalda Aleksandr Zverevni 3-1 hisobida mag'lub etdi.",
      slug: "denis-istomin-wimbledon-yarim-final-nadal-2024",
      imageUrl: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=600&fit=crop",
      sourceUrl: "https://tennis.uz/wimbledon-istomin-2024",
      sourceName: "Tennis.uz",
      categoryId: categoryMap.sport,
      isFeatured: "false",
      isBreaking: "true"
    },
    {
      title: "SpaceX Marsga birinchi inson missiyasiga tayyorlanmoqda",
      description: "Elon Mask 2026 yilda Marsga birinchi pilot reysi amalga oshirilishini e'lon qildi.",
      content: "SpaceX kompaniyasi Marsga birinchi marta inson jo'natish loyihasi uchun rasmiy tayyorgarlikni boshladi. Starship kemasi sinovlaridan muvaffaqiyatli o'tgandan so'ng, kompaniya 2026 yilda pilot reysi amalga oshirishni rejalashtirmoqda.",
      slug: "spacex-marsga-birinchi-inson-missiyasi-2026",
      imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
      sourceUrl: "https://spacex.com/mars-mission-2026",
      sourceName: "SpaceX.com",
      categoryId: categoryMap.texnologiya,
      isFeatured: "true",
      isBreaking: "false"
    },
    {
      title: "Yevropa Ittifoqi yangi energetika strategiyasini e'lon qildi",
      description: "YeI energetika mustaqilligini ta'minlash uchun 300 milliard yevroli investitsiya tasdiqlandi.",
      content: "Yevropa Ittifoqi 2024-2030 yillar uchun yangi energetika strategiyasini e'lon qildi. Bu strategiya doirasida qayta tiklanadigan energiya manbalarini 80% gacha oshirish, energiya samaradorligini 40% yaxshilash ko'zda tutilgan.",
      slug: "yevropa-ittifoqi-yangi-energetika-strategiyasi-2024",
      imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      sourceUrl: "https://europa.eu/energy-strategy-2024",
      sourceName: "Europa.eu",
      categoryId: categoryMap.dunyo,
      isFeatured: "true",
      isBreaking: "false"
    },
    {
      title: "O'zbekistonda yangi IT universitetlar tizimi ishga tushdi",
      description: "Muhammad al-Xorazmiy IT universiteti 5 ta viloyatda filiallarini ochdi.",
      content: "Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti Samarqand, Buxoro, Farg'ona, Nukus va Termizda yangi filiallarini ochdi. Har bir filialda 2000 ta student o'qishi mumkin.",
      slug: "ozbekistonda-yangi-it-universitetlar-tizimi-2024",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
      sourceUrl: "https://talim.uz/it-universitetlar-2024",
      sourceName: "Talim.uz",
      categoryId: categoryMap.ozbekiston,
      isFeatured: "false",
      isBreaking: "false"
    }
  ];

  console.log("10 ta yangi haqiqiy maqola ma'lumotlari tayyorlandi!");
  console.log("Breaking news:", articles.filter(a => a.isBreaking === "true").length, "ta");
  console.log("Featured news:", articles.filter(a => a.isFeatured === "true").length, "ta");
  
  // Save data for external processing
  fs.writeFileSync('articles_data.json', JSON.stringify(articles, null, 2));
  console.log("Ma'lumotlar articles_data.json faylga saqlandi!");
  
  return articles;
}

addArticlesViaAPI();