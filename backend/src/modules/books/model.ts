import { db } from "../utils/db";
import { Book } from "../types";
export const BookModel = {
  getAll: (limit: number = 20, offset: number = 0): Book[] => {
    return db
      .prepare(
        `
      SELECT 
        b.id, b.title, b.price, b.rating, b.description, b.url, b.created_at,
        c.name as category_name,
        a.name as author_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      JOIN authors a ON b.author_id = a.id
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `,
      )
      .all(limit, offset) as Book[];
  },

  getById: (id: number): Book | undefined => {
    return db
      .prepare(
        `
      SELECT 
        b.id, b.title, b.price, b.rating, b.description, b.url,
        c.name as category_name,
        a.name as author_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      JOIN authors a ON b.author_id = a.id
      WHERE b.id = ?
    `,
      )
      .get(id) as Book | undefined;
  },

  // Search by title or author name
  search: (query: string): Book[] => {
    return db
      .prepare(
        `
      SELECT 
        b.id, b.title, b.price, b.rating,
        c.name as category_name,
        a.name as author_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      JOIN authors a ON b.author_id = a.id
      WHERE b.title LIKE ? OR a.name LIKE ?
      LIMIT 10
    `,
      )
      .all(`%${query}%`, `%${query}%`) as Book[];
  },

  // NEW: Get all books by a specific author
  getByAuthor: (authorId: number): Book[] => {
    return db
      .prepare(
        `
      SELECT b.*, c.name as category_name, a.name as author_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      JOIN authors a ON b.author_id = a.id
      WHERE b.author_id = ?
    `,
      )
      .all(authorId) as Book[];
  },
};
