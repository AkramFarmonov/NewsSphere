// Quick test for bulk endpoint
const testData = {
  articles: [
    {
      title: "Test maqola",
      description: "Test tavsifi",
      content: "Test mazmuni",
      slug: "test-maqola-slug-unique",
      categoryId: "2cf9b566-ee64-4507-a8f2-0442faf05e73",
      publishedAt: new Date().toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop",
      sourceUrl: "https://test.uz",
      sourceName: "Test.uz",
      isFeatured: "false",
      isBreaking: "false"
    }
  ]
};

fetch('http://localhost:5000/api/temp/bulk-add-articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});