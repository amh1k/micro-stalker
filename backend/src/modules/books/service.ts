import { BookModel } from "./model";
import type { Book } from "../types";

export const BookService = {
  getPaginatedBooks: (page: number = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const books = BookModel.getAll(limit, offset);
    return books.map((book) => ({
      ...book,
      formatted_price: `£${book.price.toFixed(2)}`,
      stars: "⭐".repeat(book.rating),
    }));
  },

  getBookDetails: (id: number) => {
    const book = BookModel.getById(id);
    if (!book) throw new Error("Book not found");

    return {
      ...book,
      formatted_price: `£${book.price.toFixed(2)}`,
      stars: "⭐".repeat(book.rating),
    };
  },

  searchBooks: (query: string) => {
    if (query.length < 3) return [];

    const results = BookModel.search(query);
    return results.map((book) => ({
      ...book,
      formatted_price: `£${book.price.toFixed(2)}`,
      stars: "⭐".repeat(book.rating),
    }));
  },

  // NEW: Get books by a specific author (useful for "More from this author" features)
  getAuthorLibrary: (authorId: number) => {
    const books = BookModel.getByAuthor(authorId);
    return {
      author: books[0]?.author_name || "Unknown Author",
      total_books: books.length,
      books: books.map((book) => ({
        ...book,
        formatted_price: `£${book.price.toFixed(2)}`,
        stars: "⭐".repeat(book.rating),
      })),
    };
  },
};
