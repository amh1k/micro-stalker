const BASE_URL = "http://localhost:3001";

export interface Book {
  id: number;
  title: string;
  author_name: string | null;
  price: number;
  rating: number;
  category_name: string;
  description: string;
  url: string;
  formatted_price: string;
  stars: string;
  created_at?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  timestamp: string;
  insights: {
    summary: {
      total_items: number;
      distinct_authors: number;
      average_market_price: string;
    };
    category_distribution: {
      name: string;
      count: number;
      average_price: string;
    }[];
    top_performers: {
      author: string;
      rating: string;
      published_works: number;
    }[];
  };
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${BASE_URL}/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchBooks(
  page: number = 1
): Promise<{ success: boolean; data: Book[] }> {
  const res = await fetch(`${BASE_URL}/books?page=${page}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function searchBooks(
  query: string
): Promise<{ success: boolean; results: Book[] }> {
  const res = await fetch(
    `${BASE_URL}/books/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to search books");
  return res.json();
}

export async function fetchBookById(
  id: number
): Promise<{ success: boolean; data: Book }> {
  const res = await fetch(`${BASE_URL}/books/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch book");
  return res.json();
}
