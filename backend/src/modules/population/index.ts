import { Database } from "bun:sqlite";
export const db = new Database("data.sqlite", { create: true });
db.run(`
  CREATE TABLE IF NOT EXISTS population_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    population INTEGER,
    net_change INTEGER,
    scrape_date DATE DEFAULT (DATE('now')),
    UNIQUE(country, scrape_date)
  )
`);
