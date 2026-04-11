import * as cheerio from "cheerio";
import { db } from "../utils/db";
import { EnrichmentService } from "../books/enrichment";

export const ScraperService = {
  scrapeBooks: async (baseUrl: string) => {
    let currentUrl: string | null = baseUrl;
    let pagesProcessed = 0;
    const MAX_PAGES = 5;

    while (currentUrl && pagesProcessed < MAX_PAGES) {
      console.log(`[Page ${pagesProcessed + 1}] Scraping: ${currentUrl}`);

      const response = await fetch(currentUrl);
      const html = await response.text();
      const $ = cheerio.load(html);

      const bookElements = $(".product_pod h3 a").toArray();

      // Parallelize the deep scraping of books on this page
      // This is much faster for a 1-minute cron job
      await Promise.all(
        bookElements.map(async (el) => {
          const relativeUrl = $(el).attr("href");
          const detailUrl = new URL(relativeUrl!, currentUrl!).href;
          return ScraperService.scrapeBookDetails(detailUrl);
        }),
      );

      pagesProcessed++;

      // Find the next page
      const nextButton = $(".next a").attr("href");
      currentUrl = nextButton ? new URL(nextButton, currentUrl).href : null;

      // Small delay between pages to be respectful to the server
      if (currentUrl) await new Promise((res) => setTimeout(res, 500));
    }

    console.log(`✅ Finished. Processed ${pagesProcessed} pages.`);
  },

  scrapeBookDetails: async (url: string) => {
    try {
      // Efficiency check: If we already have this URL, skip enrichment to save API calls
      const existing = db
        .prepare("SELECT id FROM books WHERE url = ?")
        .get(url);
      if (existing) return;

      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $("h1").text().trim();
      const authorName = await EnrichmentService.findAuthor(title);
      const category = $(".breadcrumb li:nth-child(3) a").text().trim();
      const description = $("#product_description + p").text().trim();
      const price = parseFloat($(".price_color").text().replace("£", ""));

      const ratingMap: Record<string, number> = {
        One: 1,
        Two: 2,
        Three: 3,
        Four: 4,
        Five: 5,
      };
      const ratingClass =
        $(".star-rating").attr("class")?.split(" ")[1] || "Zero";
      const rating = ratingMap[ratingClass] || 0;

      // 1. Handle Relational Inserts (Category)
      db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [category]);
      const catRow = db
        .prepare("SELECT id FROM categories WHERE name = ?")
        .get(category) as { id: number };

      // 2. Handle Relational Inserts (Author)
      db.run("INSERT OR IGNORE INTO authors (name) VALUES (?)", [authorName]);
      const authorRow = db
        .prepare("SELECT id FROM authors WHERE name = ?")
        .get(authorName) as { id: number };

      // 3. Save Book with Foreign Keys
      db.prepare(
        `
        INSERT OR REPLACE INTO books (title, author_id, price, rating, description, category_id, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(title, authorRow.id, price, rating, description, catRow.id, url);
    } catch (err) {
      console.error(`❌ Failed to scrape book at ${url}`, err);
    }
  },
};
