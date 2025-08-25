import { DbStorage } from "./db-storage";
import { unsplashService } from "./services/unsplash";

const storage = new DbStorage();

async function updateAllImages() {
  console.log("Starting to update all article images with Unsplash...");

  try {
    // Get all articles
    const articles = await storage.getAllArticles(100);
    console.log(`Found ${articles.length} articles to update`);

    let updatedCount = 0;
    for (const article of articles) {
      try {
        console.log(`Updating image for: ${article.title}`);
        
        // Get new image from Unsplash
        const newImageUrl = await unsplashService.getArticleImage(
          article.title,
          article.category.name
        );

        if (newImageUrl) {
          await storage.updateArticleImage(article.id, newImageUrl);
          console.log(`✅ Updated: ${article.title.substring(0, 50)}...`);
          console.log(`   Image: ${newImageUrl}`);
          updatedCount++;
        } else {
          console.log(`❌ No image found for: ${article.title.substring(0, 50)}...`);
        }

        // Small delay to respect Unsplash rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to update article ${article.id}:`, error);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount}/${articles.length} articles with new images!`);
  } catch (error) {
    console.error("Error updating images:", error);
  }
}

// Run the update
updateAllImages().then(() => {
  console.log("Image update complete!");
  process.exit(0);
});