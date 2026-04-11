import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"; // 1. Import CORS
import { cron } from "@elysiajs/cron";
import { bookRoutes } from "./modules/books";
import { analyticsRoutes } from "./modules/analytics";
import { ScraperService } from "./modules/scraper/service";

const app = new Elysia()
  .use(cors()) // 2. Enable CORS (default allows all origins)
  .use(
    cron({
      name: "minute-sync",
      pattern: "* * * * *",
      async run() {
        console.log("🔄 Syncing books...");
        await ScraperService.scrapeBooks(
          "https://books.toscrape.com/catalogue/page-1.html",
        );
      },
    }),
  )
  .use(bookRoutes)
  .use(analyticsRoutes)
  .listen(3001);

console.log(`📖 API running at http://localhost:3001`);
