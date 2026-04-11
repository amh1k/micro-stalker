import { Database } from "bun:sqlite";

export const db = new Database("library_stalker.sqlite");
db.run("PRAGMA foreign_keys = ON;");

export const initDB = () => {
  // 1. Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // 2. NEW: Authors Table
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // 3. Updated Books Table
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      upc TEXT UNIQUE, 
      price REAL,
      rating INTEGER,
      availability TEXT,
      description TEXT,
      category_id INTEGER,
      author_id INTEGER, -- Foreign Key to authors table
      url TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (author_id) REFERENCES authors(id)
    )
  `);

  // 4. Indexes for Performance
  db.run("CREATE INDEX IF NOT EXISTS idx_book_title ON books(title);");
  db.run("CREATE INDEX IF NOT EXISTS idx_category_id ON books(category_id);");
  db.run("CREATE INDEX IF NOT EXISTS idx_author_id ON books(author_id);");

  console.log(
    "📂 Database initialized: Authors, Categories, and Books linked.",
  );
};

initDB();
