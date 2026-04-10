import { Elysia, t } from "elysia";
import { PopulationService } from "./service";
import { PopulationModel } from "./model";

export const populationRoutes = new Elysia({ prefix: "/population" })
  // GET /population - Today's top countries
  .get("/", () => {
    return {
      success: true,
      data: PopulationModel.getLatestRankings(25),
    };
  })

  // GET /population/:country - Historical trend for a country
  .get(
    "/:country",
    (context: { params: { country: any } }) => {
      // Take the whole context first
      const country = context.params.country;
      return {
        country,
        history: PopulationModel.getHistory(country),
      };
    },
    {
      params: t.Object({
        country: t.String(),
      }),
    },
  )

  // POST /population/sync - Trigger manual scrape
  .post("/sync", async () => {
    return await PopulationService.ingestDailyData();
  });
