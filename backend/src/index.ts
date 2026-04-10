import { Elysia } from "elysia";
import { cron, Patterns } from "@elysiajs/cron";
import { cors } from "@elysiajs/cors";
import { populationRoutes } from "./modules/population";
import { PopulationService } from "./modules/population/service";

const app = new Elysia()
  .use(cors())
  .use(
    cron({
      name: "minute-observer",
      pattern: "* * * * *", // <--- This triggers every minute
      async run() {
        console.log(
          `[${new Date().toLocaleTimeString()}] Automated minute sync starting...`,
        );
        await PopulationService.ingestDailyData();
      },
    }),
  )
  .use(populationRoutes)
  .listen(3001);
