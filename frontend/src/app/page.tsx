import { fetchAnalytics } from "@/lib/api";

export default async function DashboardPage() {
  let data;
  let error = "";

  try {
    const res = await fetchAnalytics();
    data = res.insights;
  } catch (e: any) {
    error = e.message || "Failed to load analytics";
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Library analytics overview</p>
        </div>
        <div className="error-banner">⚠️ {error}. Is the backend running on port 3001?</div>
      </>
    );
  }

  if (!data) return <div className="loading"><span className="spinner"></span>Loading...</div>;

  const maxCategoryCount = Math.max(
    ...data.category_distribution.map((c) => c.count),
    1
  );

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time library analytics from the book scraper</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon indigo">📚</div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <div className="stat-value">{data.summary.total_items}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✍️</div>
          <div className="stat-info">
            <h3>Authors</h3>
            <div className="stat-value">{data.summary.distinct_authors}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">💷</div>
          <div className="stat-info">
            <h3>Avg Price</h3>
            <div className="stat-value">
              £{data.summary.average_market_price}
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution + Top Authors */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Category Distribution</div>
          <ul className="category-list">
            {data.category_distribution.slice(0, 10).map((cat) => (
              <li key={cat.name} className="category-item">
                <div className="category-meta">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">
                    {cat.count} books · {cat.average_price}
                  </span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${(cat.count / maxCategoryCount) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-title">Top Rated Authors</div>
          <ul className="author-list">
            {data.top_performers.map((author, i) => (
              <li key={author.author} className="author-item">
                <span className="author-rank">{i + 1}</span>
                <div className="author-details">
                  <div className="author-name">{author.author}</div>
                  <div className="author-works">
                    {author.published_works} books
                  </div>
                </div>
                <div className="author-rating">
                  ⭐ {author.rating}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
