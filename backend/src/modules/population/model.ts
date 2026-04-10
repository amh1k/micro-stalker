import { db } from "../utils/db";
import { populationDataType } from "../types";
export const PopulationModel = {
  saveSnapshot: (data: populationDataType) => {
    return db
      .prepare(
        `
      INSERT OR REPLACE INTO population_snapshots (country, population, net_change, world_share)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(data.country, data.population, data.netChange, data.worldShare);
  },
  getLatestRankings: (limit: number = 20) => {
    return db
      .prepare(
        `
      SELECT * FROM population_snapshots 
      WHERE scrape_date = DATE('now') 
      ORDER BY population DESC 
      LIMIT ?
    `,
      )
      .all(limit);
  },

  // Get historical growth for a specific country (for charting)
  getHistory: (country: string) => {
    return db
      .prepare(
        `
      SELECT population, scrape_date 
      FROM population_snapshots 
      WHERE country = ? 
      ORDER BY scrape_date ASC
    `,
      )
      .all(country);
  },
};
