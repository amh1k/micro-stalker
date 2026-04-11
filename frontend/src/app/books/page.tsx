"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchBooks, searchBooks, type Book } from "@/lib/api";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchBooks(p);
      setBooks(res.data);
      setIsSearching(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 3) {
      loadBooks(1);
      setPage(1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await searchBooks(q);
      setBooks(res.results);
      setIsSearching(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [loadBooks]);

  useEffect(() => {
    loadBooks(page);
  }, [page, loadBooks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <>
      <div className="page-header">
        <h1>Books</h1>
        <p>Browse and search the scraped book catalog</p>
      </div>

      {/* Search Bar */}
      <div className="books-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="book-search"
            type="text"
            className="search-input"
            placeholder="Search by title or author (min 3 chars)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-banner">⚠️ {error}. Is the backend running?</div>
      )}

      {loading ? (
        <div className="loading">
          <span className="spinner"></span>Loading books...
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📭</div>
          <p>No books found. {isSearching ? "Try a different search." : "Wait for the cron job to scrape some."}</p>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="book-card"
              >
                <div className="book-card-header">
                  <span className="book-card-title">{book.title}</span>
                  <span className="book-card-price">
                    {book.formatted_price}
                  </span>
                </div>
                <div className="book-card-author">
                  {book.author_name || "Unknown Author"}
                </div>
                <div className="book-card-footer">
                  <span className="book-card-rating">{book.stars}</span>
                  <span className="badge">{book.category_name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {!isSearching && (
            <div className="pagination">
              <button
                className="pagination-btn primary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <span className="pagination-info">Page {page}</span>
              <button
                className="pagination-btn primary"
                disabled={books.length < 20}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
