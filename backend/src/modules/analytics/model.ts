import { db } from "../utils/db";
export const AnalyticsModel = {
  // Get general stats about the library
  getGlobalOverview: () => {
    return db
      .prepare(
        `
      SELECT 
        (SELECT COUNT(*) FROM books) as total_books,
        (SELECT COUNT(*) FROM authors) as total_authors,
        (SELECT COUNT(*) FROM categories) as total_categories,
        AVG(price) as global_avg_price
      FROM books
    `,
      )
      .get() as {
      total_books: number;
      total_authors: number;
      total_categories: number;
      global_avg_price: number;
    };
  },

  // Which authors have the highest average rating?
  getTopRatedAuthors: (limit: number = 5) => {
    return db
      .prepare(
        `
      SELECT a.name, AVG(b.rating) as avg_rating, COUNT(b.id) as book_count
      FROM authors a
      JOIN books b ON a.id = b.author_id
      GROUP BY a.id
      HAVING book_count > 1
      ORDER BY avg_rating DESC
      LIMIT ?
    `,
      )
      .all(limit);
  },

  // Average price and book count per category
  getCategoryStats: () => {
    return db
      .prepare(
        `
      SELECT c.name, COUNT(b.id) as count, AVG(b.price) as avg_price
      FROM categories c
      JOIN books b ON c.id = b.category_id
      GROUP BY c.id
      ORDER BY count DESC
    `,
      )
      .all();
  },
};
