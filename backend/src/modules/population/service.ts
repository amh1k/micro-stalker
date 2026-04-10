import * as cheerio from "cheerio";
import { PopulationModel } from "./model";

export const PopulationService = {
  ingestDailyData: async () => {
    console.log(`[${new Date().toISOString()}] Starting Data Ingestion...`);

    try {
      // 1. Fetch with Browser-like Headers to bypass simple bot filters
      const response = await fetch(
        "https://www.worldometers.info/world-population/population-by-country/",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(15000), // 15s timeout
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // 2. Identify the correct table (Targeting the one containing "Pakistan")
      const table = $("table")
        .filter((_, el) => $(el).text().includes("Pakistan"))
        .first();
      const rows = table.find("tbody tr");

      if (rows.length === 0) {
        throw new Error(
          "Selector Error: No data rows found in the target table.",
        );
      }

      const results: string[] = [];

      // 3. Process Rows using Column Indexes (Framework-Agnostic)
      rows.each((_, el) => {
        try {
          const cells = $(el).find("td");

          // Index mapping based on Worldometer's layout:
          // 1: Country, 2: Population, 4: Net Change, 11: World Share
          const country = $(cells[1]).text().trim();
          const populationRaw = $(cells[2]).text().replace(/,/g, "");
          const netChangeRaw = $(cells[4]).text().replace(/,/g, "");
          const worldShareRaw = $(cells[11]).text().replace("%", "");

          const population = parseInt(populationRaw);
          const netChange = parseInt(netChangeRaw);
          const worldShare = parseFloat(worldShareRaw);

          if (country && !isNaN(population)) {
            PopulationModel.saveSnapshot({
              country,
              population,
              netChange: isNaN(netChange) ? 0 : netChange,
              worldShare: isNaN(worldShare) ? 0 : worldShare,
            });
            results.push(country);
          }
        } catch (rowErr) {
          // Log row error but continue with the rest of the list
          console.warn(
            `Skipping row for ${$(el).find("td:nth-child(2)").text()}: Parsing failed.`,
          );
        }
      });

      console.log(`✅ Success: Processed ${results.length} countries.`);
      console.log(results);

      return {
        processed: results.length,
        status: "Success",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("❌ CRITICAL: Ingestion Failed!", error.message);

      return {
        processed: 0,
        status: "Error",
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
