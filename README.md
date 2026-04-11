<div align="center">

# 📖 BookStalker

**An automated book catalog intelligence platform**

A full-stack web application that scrapes, enriches, and visualizes book data in real-time using cron-driven pipelines and a modern analytics dashboard.

[![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun&logoColor=000)](https://bun.sh)
[![Elysia](https://img.shields.io/badge/API-Elysia-6c5ce7)](https://elysiajs.com)
[![Next.js](https://img.shields.io/badge/frontend-Next.js_16-000?logo=next.js)](https://nextjs.org)
[![SQLite](https://img.shields.io/badge/database-SQLite-003B57?logo=sqlite)](https://www.sqlite.org)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=fff)](https://typescriptlang.org)

</div>

---

## 🧭 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Frontend Dashboard](#frontend-dashboard)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

BookStalker is a **cron-powered web scraping pipeline** paired with a polished **analytics dashboard**. Every minute, a background job scrapes book listings from [Books to Scrape](https://books.toscrape.com), enriches each entry with author data from the Google Books API, and persists everything into a normalized SQLite database. The frontend dashboard provides real-time insights into the scraped catalog.

### Key Features

| Feature | Description |
|---|---|
| 🔄 **Automated Scraping** | Cron job runs every 60 seconds, scraping up to 5 pages of book listings per cycle |
| 📖 **Deep Scraping** | For each book, follows the detail link to extract title, price, rating, category, and description |
| ✍️ **Author Enrichment** | Queries the Google Books API to resolve author names from book titles |
| 🗃️ **Normalized Storage** | Relational SQLite schema with `books`, `authors`, and `categories` tables with proper foreign keys and indexes |
| 📊 **Analytics Dashboard** | Next.js dashboard with stat cards, category distribution bars, and author rankings |
| 🔍 **Catalog Search** | Full-text search across book titles and author names with paginated results |
| 📱 **Responsive Design** | Flat design system with subtle shadows, collapsible sidebar for mobile viewports |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    BookStalker System                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐    Cron (1m)    ┌──────────────────┐   │
│   │   Elysia    │◄──────────────►│   Scraper        │   │
│   │   Server    │                │   Service         │   │
│   │  :3001      │                │                    │   │
│   └──────┬──────┘                │  ┌──────────────┐ │   │
│          │                       │  │  Enrichment  │ │   │
│          │ REST API              │  │  (Google API)│ │   │
│          │                       │  └──────────────┘ │   │
│          │                       └────────┬─────────┘   │
│          │                                │              │
│          │         ┌──────────┐           │              │
│          │         │  SQLite  │◄──────────┘              │
│          └────────►│    DB    │                          │
│                    └──────────┘                          │
│                         ▲                                │
│   ┌─────────────┐       │                                │
│   │  Next.js    │───────┘ (via API)                      │
│   │  Dashboard  │                                        │
│   │  :3000      │                                        │
│   └─────────────┘                                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Cron Trigger** → Every minute, `@elysiajs/cron` fires the `minute-sync` job
2. **Page Scraping** → Cheerio parses the catalog listing, extracts book links (up to 5 pages)
3. **Detail Scraping** → Each book's detail page is scraped in parallel via `Promise.all`
4. **Author Enrichment** → The Google Books API is queried to resolve the author name
5. **Persistence** → Book data is upserted into SQLite with relational links to `authors` and `categories`
6. **API Serving** → Elysia exposes REST endpoints for books and analytics
7. **Dashboard** → Next.js fetches the API and renders stat cards, charts, and catalog views

---

## Tech Stack

### Backend

| Technology | Role |
|---|---|
| [Bun](https://bun.sh) | JavaScript runtime and package manager |
| [Elysia](https://elysiajs.com) | High-performance HTTP framework |
| [@elysiajs/cron](https://www.npmjs.com/package/@elysiajs/cron) | Cron job scheduling |
| [@elysiajs/cors](https://www.npmjs.com/package/@elysiajs/cors) | Cross-origin resource sharing |
| [Cheerio](https://cheerio.js.org) | HTML parsing and scraping |
| [SQLite](https://bun.sh/docs/api/sqlite) (via `bun:sqlite`) | Embedded relational database |
| [Zod](https://zod.dev) | Runtime schema validation |

### Frontend

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://typescriptlang.org) | Type safety |
| Vanilla CSS | Flat design system with CSS custom properties |

---

## Project Structure

```
cron-job/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Entry point — Elysia server + cron setup
│   │   └── modules/
│   │       ├── types.ts                # Shared TypeScript interfaces
│   │       ├── scraper/
│   │       │   └── service.ts          # Web scraping logic (Cheerio + pagination)
│   │       ├── books/
│   │       │   ├── index.ts            # Book REST routes (/books)
│   │       │   ├── model.ts            # Database queries (getAll, getById, search)
│   │       │   ├── service.ts          # Business logic (formatting, pagination)
│   │       │   └── enrichment.ts       # Google Books API author lookup
│   │       ├── analytics/
│   │       │   ├── index.ts            # Analytics REST routes (/analytics)
│   │       │   ├── model.ts            # Aggregate queries (stats, top authors)
│   │       │   └── service.ts          # Insight formatting
│   │       └── utils/
│   │           └── db/
│   │               └── index.ts        # SQLite database initialization
│   ├── library_stalker.sqlite          # SQLite database file (auto-generated)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css             # Design system (flat design + subtle shadows)
│   │   │   ├── layout.tsx              # Root layout with sidebar
│   │   │   ├── page.tsx                # Dashboard (analytics overview)
│   │   │   └── books/
│   │   │       ├── page.tsx            # Book catalog (search + pagination)
│   │   │       └── [id]/
│   │   │           └── page.tsx        # Book detail view
│   │   ├── components/
│   │   │   ├── Sidebar.tsx             # Navigation sidebar component
│   │   │   └── Sidebar.module.css      # Sidebar styling
│   │   └── lib/
│   │       └── api.ts                  # API client for backend communication
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

| Dependency | Version | Installation |
|---|---|---|
| **Bun** | ≥ 1.0 | `curl -fsSL https://bun.sh/install \| bash` |
| **Node.js** | ≥ 18 | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9 | Bundled with Node.js |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/book-stalker.git
cd book-stalker
```

**2. Install backend dependencies**

```bash
cd backend
bun install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Running the Project

You need **two terminal windows** — one for the backend and one for the frontend.

**Terminal 1 — Backend API + Cron Scraper**

```bash
cd backend
bun run dev
```

The backend starts at **http://localhost:3001**. The cron job begins scraping immediately and repeats every 60 seconds. You will see logs like:

```
📖 API running at http://localhost:3001
🔄 Syncing books...
[Page 1] Scraping: https://books.toscrape.com/catalogue/page-1.html
[Page 2] Scraping: https://books.toscrape.com/catalogue/page-2.html
...
✅ Finished. Processed 5 pages.
```

**Terminal 2 — Frontend Dashboard**

```bash
cd frontend
npm run dev
```

The dashboard starts at **http://localhost:3000**. Open it in your browser.

> [!IMPORTANT]
> The backend **must be running** before the frontend can display data. If the backend is down, the dashboard will show graceful error banners.

---

## API Reference

All endpoints return JSON. Base URL: `http://localhost:3001`

### Books

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/books` | Fetch paginated books (20 per page) | `page` (default: `1`) |
| `GET` | `/books/search` | Search by title or author name | `q` (min 3 characters) |
| `GET` | `/books/:id` | Fetch a single book by ID | — |

**Example Response — `GET /books?page=1`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "A Light in the Attic",
      "author_name": "Shel Silverstein",
      "price": 51.77,
      "rating": 3,
      "category_name": "Poetry",
      "description": "It's hard to imagine a world without...",
      "url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
      "formatted_price": "£51.77",
      "stars": "⭐⭐⭐"
    }
  ]
}
```

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics` | Library-wide statistics and insights |

**Example Response — `GET /analytics`**

```json
{
  "success": true,
  "timestamp": "2026-04-11T15:00:00.000Z",
  "insights": {
    "summary": {
      "total_items": 200,
      "distinct_authors": 150,
      "average_market_price": "35.63"
    },
    "category_distribution": [
      { "name": "Default", "count": 65, "average_price": "£34.21" },
      { "name": "Music", "count": 14, "average_price": "£40.11" }
    ],
    "top_performers": [
      { "author": "J.K. Rowling", "rating": "5.0", "published_works": 3 }
    ]
  }
}
```

---

## Database Schema

The SQLite database (`library_stalker.sqlite`) uses a **normalized relational schema** with three tables:

```sql
-- Categories table
CREATE TABLE categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT UNIQUE NOT NULL
);

-- Authors table
CREATE TABLE authors (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT UNIQUE NOT NULL
);

-- Books table (with foreign keys)
CREATE TABLE books (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  upc           TEXT UNIQUE,
  price         REAL,
  rating        INTEGER,
  availability  TEXT,
  description   TEXT,
  category_id   INTEGER REFERENCES categories(id),
  author_id     INTEGER REFERENCES authors(id),
  url           TEXT UNIQUE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_book_title  ON books(title);
CREATE INDEX idx_category_id ON books(category_id);
CREATE INDEX idx_author_id   ON books(author_id);
```

**Entity Relationship:**

```
┌────────────┐       ┌──────────┐       ┌──────────────┐
│  authors   │       │  books   │       │  categories  │
├────────────┤       ├──────────┤       ├──────────────┤
│ id (PK)    │◄──────│author_id │       │ id (PK)      │
│ name       │       │category_id──────►│ name         │
└────────────┘       │ title    │       └──────────────┘
                     │ price    │
                     │ rating   │
                     │ url (UQ) │
                     └──────────┘
```

---

## Frontend Dashboard

The dashboard follows a **Flat Design** aesthetic with subtle shadows and an indigo accent palette.

### Pages

| Route | Description |
|---|---|
| `/` | **Dashboard** — Summary stat cards (total books, authors, avg price), category distribution bar chart, top-rated authors ranking |
| `/books` | **Catalog** — Searchable, paginated grid of book cards with title, author, price, rating, and category badge |
| `/books/:id` | **Book Detail** — Full book information with price/rating/category stat cards and description |

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#f0f2f5` | Page surface |
| Card | `#ffffff` | All card components |
| Accent | `#4f46e5` | Active links, badges, buttons |
| Shadow | `0 1px 3px rgba(0,0,0,0.06)` | Card elevation |
| Font | Inter (Google Fonts) | All text |
| Radius | `12px` | Card corners |

---

## Configuration

| Parameter | Location | Default | Description |
|---|---|---|---|
| Cron pattern | `backend/src/index.ts` | `* * * * *` (every minute) | Scraping frequency |
| Max pages per cycle | `backend/src/modules/scraper/service.ts` | `5` | Number of catalog pages scraped per cron tick |
| Page delay | `backend/src/modules/scraper/service.ts` | `500ms` | Delay between page scrapes (rate limiting) |
| Books per page | `backend/src/modules/books/service.ts` | `20` | Pagination page size |
| Search minimum chars | `backend/src/modules/books/service.ts` | `3` | Minimum query length for search |
| Backend port | `backend/src/index.ts` | `3001` | API server port |
| Frontend port | `frontend/package.json` | `3000` | Dashboard dev server port |
| API base URL | `frontend/src/lib/api.ts` | `http://localhost:3001` | Backend URL for frontend API calls |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -m 'feat: add new feature'`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. **Open** a Pull Request

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with 🔥 **Bun** + **Elysia** + **Next.js** + **Cheerio** + **SQLite**

</div>
