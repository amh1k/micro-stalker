import Link from "next/link";
import { fetchBookById } from "@/lib/api";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let book;
  let error = "";

  try {
    const res = await fetchBookById(parseInt(id));
    if (!res.success) throw new Error("Book not found");
    book = res.data;
  } catch (e: any) {
    error = e.message || "Failed to load book";
  }

  if (error) {
    return (
      <div className="book-detail">
        <Link href="/books" className="back-link">
          ← Back to Books
        </Link>
        <div className="error-banner">⚠️ {error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="loading">
        <span className="spinner"></span>Loading...
      </div>
    );
  }

  const stars = "⭐".repeat(book.rating);

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <Link href="/books" className="back-link">
          ← Back to Books
        </Link>
        <h1 className="book-detail-title">{book.title}</h1>
        <p className="book-detail-author">
          by {book.author_name || "Unknown Author"}
        </p>
      </div>

      <div className="book-detail-meta">
        <div className="stat-card">
          <div className="stat-icon blue">💷</div>
          <div className="stat-info">
            <h3>Price</h3>
            <div className="stat-value">{book.formatted_price}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">⭐</div>
          <div className="stat-info">
            <h3>Rating</h3>
            <div className="stat-value">{stars}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon indigo">🏷️</div>
          <div className="stat-info">
            <h3>Category</h3>
            <div className="stat-value" style={{ fontSize: "1rem" }}>
              {book.category_name}
            </div>
          </div>
        </div>
      </div>

      {book.description && (
        <div className="card">
          <div className="card-title">Description</div>
          <p className="book-detail-description">{book.description}</p>
        </div>
      )}
    </div>
  );
}
