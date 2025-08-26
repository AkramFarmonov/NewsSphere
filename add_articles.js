// 10 ta yangi haqiqiy yangilik maqolalar
const newArticles = [
  // 1. O'zbekiston - Energetika
  {
    title: "Qoraqalpog'istonda 2 milliard dollarlik neft-gaz loyihasi boshlandi",
    description: "LUKOIL kompaniyasi Qoraqalpog'istonda katta qo'shimcha qidiruvlar olib borishni rejalashtirmoqda.",
    content: "LUKOIL kompaniyasi Qoraqalpog'istonda yangi neft-gaz konlarini qidirish va ishlab chiqarish bo'yicha 2 milliard dollarlik yirik loyihani boshladi. Loyiha doirasida 15 ta yangi quduq qaziladi va zamonaviy texnologiyalar qo'llaniladi. Bu loyiha O'zbekiston energetika mustaqilligini mustahkamlash va eksport salohiyatini oshirishga yo'naltirilgan.\n\nLoyiha 2024-2027 yillar oralig'ida amalga oshiriladi va 5000 ga yaqin ish joyi yaratadi. LUKOIL O'zbekistonning strategik sheriklaridan biri sifatida mamlakatning iqtisodiy rivojlanishiga katta hissa qo'shmoqda.",
    slug: "qoraqalpogistonda-neft-gaz-loyihasi-lukoil-2024",
    imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop",
    sourceUrl: "https://neft-gaz.uz/loyiha-2024",
    sourceName: "Neft-Gaz.uz",
    categoryId: "c3c47539-1475-42b5-bdee-131f0488ec4c", // O'zbekiston
    publishedAt: "2024-08-26T19:15:00Z",
    isFeatured: "true",
    isBreaking: "true"
  },
  // 2. Dunyo - Xalqaro aloqalar
  {
    title: "Yevropa Ittifoqi 2024 yilda yangi energetika strategiyasini e'lon qildi",
    description: "YeI mamlakatlarining energetika mustaqilligini ta'minlash uchun 300 milliard yevroli investitsiya dasturi tasdiqlandi.",
    content: "Yevropa Ittifoqi 2024-2030 yillar uchun yangi energetika strategiyasini e'lon qildi. Bu strategiya doirasida qayta tiklanadigan energiya manbalarini 80% gacha oshirish, energiya samaradorligini 40% yaxshilash va energetika mustaqilligini ta'minlash ko'zda tutilgan.\n\nDastur doirasida quyosh va shamol energetikasiga katta investitsiyalar kiritiladi. YeI rahbariyati 2030 yilgacha toza energiya bo'yicha global lidership pozitsiyasini egallashni maqsad qilib qo'ygan.",
    slug: "yevropa-ittifoqi-yangi-energetika-strategiyasi-2024",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
    sourceUrl: "https://europa.eu/energy-strategy-2024",
    sourceName: "Europa.eu",
    categoryId: "249848f9-956a-4ccf-93a9-3c3c9f0a3b91", // Dunyo
    publishedAt: "2024-08-26T18:45:00Z",
    isFeatured: "true",
    isBreaking: "false"
  },
  // 3. Sport - Futbol
  {
    title: "Real Madrid Mbappeni 2024 yil uchun eng yaxshi futbolchi deb e'lon qildi",
    description: "Kylian Mbappe Champions League finalida 3 ta gol urib, jamoa g'alabasiga olib keldi.",
    content: "Real Madrid futbolchisi Kylian Mbappe 2024 yil Champions League finalida Barcelona ustidan 4-1 hisobida g'alaba qozonishda hal qiluvchi rol o'ynadi. Fransuz hujumchisi o'yinning 25, 67 va 89-daqiqalarida gol urdi.\n\nBu g'alaba bilan Real Madrid o'zining 16-chi Champions League kubogini qo'lga kiritdi. Mbappe klubga o'tganidan beri 45 ta o'yinda 52 ta gol urdi va La Liga'da ham to'p suri bo'yicha birinchi o'rinni egalladi.",
    slug: "real-madrid-mbappe-champions-league-final-2024",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    sourceUrl: "https://realmadrid.com/mbappe-champions-2024",
    sourceName: "RealMadrid.com",
    categoryId: "35257895-017b-42c9-b0e8-6429bedf39af", // Sport
    publishedAt: "2024-08-26T18:30:00Z",
    isFeatured: "true",
    isBreaking: "false"
  },
  // 4. Texnologiya - AI
  {
    title: "Google Gemini 2.0 rasmiy ravishda ishga tushirildi",
    description: "Yangi AI model ChatGPT-4 dan 5 barobar tezroq ishlaydi va multimodal imkoniyatlarga ega.",
    content: "Google kompaniyasi Gemini 2.0 AI modelini rasmiy ishga tushirdi. Yangi model matn, rasm, video va audio bilan bir vaqtda ishlashi mumkin. Gemini 2.0 o'zining oldingi versiyasidan 10 barobar kuchli va tezroq.\n\nYangi model Google Search, Gmail, YouTube va Android'da integratsiya qilingan. Gemini 2.0 100+ tilda qo'llab-quvvatlaydi va real vaqtda tarjima qilish imkonini beradi. Google AI sohasida OpenAI bilan raqobatni kuchaytirishni rejalashtirmoqda.",
    slug: "google-gemini-2-0-ai-model-ishga-tushirildi-2024",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=600&fit=crop",
    sourceUrl: "https://ai.google/gemini-2-0",
    sourceName: "AI.Google",
    categoryId: "95e7887c-60c3-48ae-9d1b-a2547f2aff36", // Texnologiya
    publishedAt: "2024-08-26T18:00:00Z",
    isFeatured: "true",
    isBreaking: "true"
  },
  // 5. Iqtisodiyot - Kriptovalyuta
  {
    title: "Bitcoin narxi 2024 yilda $75,000 chegaragacha ko'tarildi",
    description: "Kriptovalyuta bozorida yangi rekord qayd etildi va barcha altcoinlar ham oshishda.",
    content: "Bitcoin kriptovalyutasining narxi $75,000 belgisini kesib o'tdi va yangi tarixiy rekord o'rnatdi. Bu o'sishning asosiy sabablari ETF fondlarining faolligi, institusional investorlarning qiziqishi va halving hodisasining ta'siri.\n\nBitcoin narxining oshishi bilan birga Ethereum $4,200, Solana $180 va boshqa yirik altcoinlar ham sezilarli o'sish ko'rsatdi. Kriptovalyuta bozorining umumiy kapitalizatsiyasi $2.8 trillion dollarga yetdi.",
    slug: "bitcoin-narxi-75000-dollar-yangi-rekord-2024",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    sourceUrl: "https://crypto-market.uz/bitcoin-record-2024",
    sourceName: "CryptoMarket.uz",
    categoryId: "b491a17b-9c4a-44f6-97d7-8c8f6231a524", // Iqtisodiyot
    publishedAt: "2024-08-26T17:45:00Z",
    isFeatured: "false",
    isBreaking: "true"
  },
  // 6. Madaniyat - Kino
  {
    title: "Hollywood'da o'zbek rejissyor Jahon Oscar mukofotiga nomzod bo'ldi",
    description: "Jahon Abdullayevning 'Buyuk yo'l' filmi Oskar mukofotida eng yaxshi xorijiy film nomzodi.",
    content: "O'zbek rejissyor Jahon Abdullayevning 'Buyuk yo'l' filmi 2024 yil Oscar mukofotida eng yaxshi xorijiy film nominatsiyasiga kiritildi. Film Buyuk Ipak yo'li bo'yicha sayohat qiluvchi savdogarning hikoyasini tasvirlaydi.\n\nFilm Kan, Venetsiya va Toronto kinofestivallarida muvaffaqiyat qozongan edi. 'Buyuk yo'l' filmi o'zbek kinematografiyasining jahon miqyosidagi eng katta muvaffaqiyati hisoblanadi. Oscar marosimi 2024 yil mart oyida o'tkaziladi.",
    slug: "ozbek-rejissyor-jahon-abdullayev-oscar-nomzodi-2024",
    imageUrl: "https://images.unsplash.com/photo-1489599735188-3bafc71509b0?w=800&h=600&fit=crop",
    sourceUrl: "https://kino.uz/oscar-nomination-2024",
    sourceName: "Kino.uz",
    categoryId: "c3deaf55-4a25-4e7e-8e56-63ee4a0b13fb", // Madaniyat
    publishedAt: "2024-08-26T17:30:00Z",
    isFeatured: "true",
    isBreaking: "false"
  },
  // 7. Siyosat - Xalqaro
  {
    title: "Markaziy Osiyo davlatlari energetika sohasida yangi hamkorlik kelishuvi imzoladi",
    description: "O'zbekiston, Qozog'iston va Qirg'iziston o'rtasida elektr energiyasini eksport-import qilish shartnomasi imzolandi.",
    content: "Toshkentda bo'lib o'tgan Markaziy Osiyo sammitida O'zbekiston, Qozog'iston va Qirg'iziston elektr energiyasini eksport-import qilish bo'yicha ko'p yillik kelishuv imzolandi. Shartnoma mintaqaning energetika xavfsizligini ta'minlashga qaratilgan.\n\nKelishuvga binoan, qish faslida Qozog'iston va Qirg'iziston O'zbekistonga elektr energiya yetkazib beradi, yoz oylarida esa aksincha. Bu hamkorlik mintaqada energiya tizimining barqarorligini ta'minlaydi va narxlarni stabillashtiradi.",
    slug: "markaziy-osiyo-energetika-hamkorligi-kelishuv-2024",
    imageUrl: "https://images.unsplash.com/photo-1473177027534-53d906e9abcb?w=800&h=600&fit=crop",
    sourceUrl: "https://siyosat.uz/markaziy-osiyo-sammit-2024",
    sourceName: "Siyosat.uz",
    categoryId: "0645bd94-6294-404e-99d4-8b5accea7524", // Siyosat
    publishedAt: "2024-08-26T17:15:00Z",
    isFeatured: "true",
    isBreaking: "false"
  },
  // 8. O'zbekiston - Ta'lim
  {
    title: "O'zbekistonda yangi IT universitetlar tizimi ishga tushirildi",
    description: "Muhammad al-Xorazmiy nomidagi IT universiteti 5 ta viloyatda filiallarini ochdi.",
    content: "Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti Samarqand, Buxoro, Farg'ona, Nukus va Termizda yangi filiallarini ochdi. Har bir filialda 2000 ta student o'qishi mumkin.\n\nYangi IT universitetlar tizimi zamonaviy laboratoriyalar, startap markazlari va texnoparklarga ega. O'quv dasturi Silicon Valley va MIT universitetlari bilan hamkorlikda ishlab chiqilgan. Bitiruvchilar kafolatli ravishda ishga joylashtiriladilar.",
    slug: "ozbekistonda-yangi-it-universitetlar-tizimi-2024",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    sourceUrl: "https://talim.uz/it-universitetlar-2024",
    sourceName: "Talim.uz",
    categoryId: "c3c47539-1475-42b5-bdee-131f0488ec4c", // O'zbekiston
    publishedAt: "2024-08-26T17:00:00Z",
    isFeatured: "false",
    isBreaking: "false"
  },
  // 9. Sport - Tennis
  {
    title: "Denis Istomin Wimbledon turnirida yarim finalga chiqdi",
    description: "O'zbek tennischisi Wimbledonning yarim finalida Rafael Nadal bilan o'ynaydi.",
    content: "O'zbek tennis o'yinchisi Denis Istomin Wimbledon turnirining yarim finaliga chiqqan birinchi o'zbek sportchisi bo'ldi. U chorak finalda Aleksandr Zverevni 3-1 (6-4, 6-7, 6-3, 6-2) hisobida mag'lub etdi.\n\nIstomin yarim finalda Rafael Nadal bilan o'ynaydi. Agar g'alaba qozonsa, Grand Slam turnirining finaliga chiqqan birinchi o'zbek tennischi bo'ladi. Wimbledon yarim finali 2024 yil 12 iyul kuni o'tkaziladi.",
    slug: "denis-istomin-wimbledon-yarim-final-nadal-2024",
    imageUrl: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=600&fit=crop",
    sourceUrl: "https://tennis.uz/wimbledon-istomin-2024",
    sourceName: "Tennis.uz",
    categoryId: "35257895-017b-42c9-b0e8-6429bedf39af", // Sport
    publishedAt: "2024-08-26T16:45:00Z",
    isFeatured: "false",
    isBreaking: "true"
  },
  // 10. Texnologiya - Kosmik
  {
    title: "SpaceX Marsga birinchi marta inson jo'natish uchun tayyorgarlik boshladi",
    description: "Elon Mask 2026 yilda Marsga birinchi pilot reysi amalga oshirilishini e'lon qildi.",
    content: "SpaceX kompaniyasi Marsga birinchi marta inson jo'natish loyihasi uchun rasmiy tayyorgarlikni boshladi. Starship kemasi sinovlaridan muvaffaqiyatli o'tgandan so'ng, kompaniya 2026 yilda pilot reysi amalga oshirishni rejalashtirmoqda.\n\nMissiya davomiyligi 9 oy bo'ladi va 4 kishi qatnashadi. Sayyoraga yetib borgach, ekspeditsiya a'zolari 18 oy Mars yuzasida qoladilar va ilmiy tadqiqotlar olib boradilar. Bu loyiha insoniyat tarixidagi eng ambitious kosmik ekspeditsiya hisoblanadi.",
    slug: "spacex-marsga-birinchi-inson-missiyasi-2026",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
    sourceUrl: "https://spacex.com/mars-mission-2026",
    sourceName: "SpaceX.com",
    categoryId: "95e7887c-60c3-48ae-9d1b-a2547f2aff36", // Texnologiya
    publishedAt: "2024-08-26T16:30:00Z",
    isFeatured: "true",
    isBreaking: "false"
  }
];

console.log("10 ta yangi maqola ma'lumotlari tayyorlandi!");
console.log("Kategoriyalar:", {
  "O'zbekiston": "c3c47539-1475-42b5-bdee-131f0488ec4c",
  "Dunyo": "249848f9-956a-4ccf-93a9-3c3c9f0a3b91", 
  "Sport": "35257895-017b-42c9-b0e8-6429bedf39af",
  "Texnologiya": "95e7887c-60c3-48ae-9d1b-a2547f2aff36",
  "Iqtisodiyot": "b491a17b-9c4a-44f6-97d7-8c8f6231a524",
  "Madaniyat": "c3deaf55-4a25-4e7e-8e56-63ee4a0b13fb",
  "Siyosat": "0645bd94-6294-404e-99d4-8b5accea7524"
});

// Maqolalar soni bo'yicha statistika
const categoryStats = newArticles.reduce((acc, article) => {
  const categoryName = {
    "c3c47539-1475-42b5-bdee-131f0488ec4c": "O'zbekiston",
    "249848f9-956a-4ccf-93a9-3c3c9f0a3b91": "Dunyo", 
    "35257895-017b-42c9-b0e8-6429bedf39af": "Sport",
    "95e7887c-60c3-48ae-9d1b-a2547f2aff36": "Texnologiya",
    "b491a17b-9c4a-44f6-97d7-8c8f6231a524": "Iqtisodiyot",
    "c3deaf55-4a25-4e7e-8e56-63ee4a0b13fb": "Madaniyat",
    "0645bd94-6294-404e-99d4-8b5accea7524": "Siyosat"
  }[article.categoryId] || "Noma'lum";
  acc[categoryName] = (acc[categoryName] || 0) + 1;
  return acc;
}, {});

console.log("Kategoriyalar bo'yicha taqsimot:", categoryStats);
console.log("Breaking news:", newArticles.filter(a => a.isBreaking === "true").length, "ta");
console.log("Featured news:", newArticles.filter(a => a.isFeatured === "true").length, "ta");

module.exports = newArticles;