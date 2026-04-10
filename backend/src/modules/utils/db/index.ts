import { Database } from "bun:sqlite";
export const db = new Database("macro_stalker.sqlite", { create: true });
db.run(`
  CREATE TABLE IF NOT EXISTS population_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT NOT NULL,
    population INTEGER NOT NULL,
    net_change INTEGER,
    world_share REAL,
    scrape_date DATE DEFAULT (DATE('now')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country, scrape_date)
  )
`);
