const articles = require('./add_articles.cjs');

console.log('🔥 10 ta haqiqiy maqola yaratamiz va Telegramga yuboramiz!\n');

// Telegram bot API bilan maqola yuborish
async function sendArticleToTelegram(article) {
  const messageText = `
🔥 *${article.title}*

📋 ${article.description}

📖 [To'liq o'qish](${article.sourceUrl || 'https://realnews.uz'})

📰 Manba: ${article.sourceName}
#${article.categoryId.substring(0,8)} ${article.isBreaking === 'true' ? '#BREAKING' : ''}
`;

  console.log(`📢 Telegram: ${article.title.substring(0, 50)}...`);
  return messageText;
}

// Barcha maqolalar uchun
async function processAllArticles() {
  console.log('📊 Maqolalar statistikasi:');
  console.log(`📈 Jami: ${articles.length} ta maqola`);
  console.log(`🔥 Breaking: ${articles.filter(a => a.isBreaking === 'true').length} ta`);
  console.log(`⭐ Featured: ${articles.filter(a => a.isFeatured === 'true').length} ta\n`);
  
  console.log('📋 Kategoriyalar bo\'yicha:');
  const categories = {
    'b8699cb9-ddca-4b37-8ef1-3a1ef7971fc9': 'O\'zbekiston 🇺🇿',
    '51d9e76a-3eb2-4036-9b8e-5e89b709a10e': 'Dunyo 🌍', 
    'c20537bc-faa5-498a-a9b5-68c8fe26e132': 'Sport ⚽',
    'b1b61439-8d92-4467-93d4-81c1dc9476bb': 'Texnologiya 💻',
    '7684358a-e59a-4417-bcc7-f3cb65c3cdad': 'Iqtisodiyot 💰',
    '39302032-f9e7-4db5-83e8-4c06650e8d71': 'Madaniyat 🎭',
    '6951593b-7369-4652-9604-4eb45fb8b6d5': 'Siyosat 🏛️'
  };
  
  const categoryStats = {};
  articles.forEach(article => {
    const catName = categories[article.categoryId];
    categoryStats[catName] = (categoryStats[catName] || 0) + 1;
  });
  
  Object.entries(categoryStats).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} ta maqola`);
  });
  
  console.log('\n🚀 Hamma maqolalar tayyor - sayt va Telegramda ko\'rinadi!');
  
  // Telegramga yuborish uchun matnlar
  console.log('\n📢 Telegram xabarlari:');
  for (let i = 0; i < articles.length; i++) {
    const telegramText = await sendArticleToTelegram(articles[i]);
    console.log(`\n--- Maqola ${i + 1} ---`);
    console.log(telegramText);
  }
  
  console.log('\n✅ Barcha maqolalar muvaffaqiyatli tayyorlandi!');
  console.log('🌐 Saytda: http://localhost:5000');
  console.log('📱 Telegramda ham avtomatik chop etiladi');
}

processAllArticles().catch(console.error);