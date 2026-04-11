import { AnalyticsModel } from "./model";

export const AnalyticsService = {
  getLibraryInsights: () => {
    const overview = AnalyticsModel.getGlobalOverview();
    const categories = AnalyticsModel.getCategoryStats();
    const topAuthors = AnalyticsModel.getTopRatedAuthors();

    return {
      summary: {
        total_items: overview.total_books,
        distinct_authors: overview.total_authors,
        average_market_price: overview.global_avg_price?.toFixed(2) ?? "0.00",
      },
      category_distribution: categories.map((c: any) => ({
        name: c.name,
        count: c.count,
        average_price: `£${c.avg_price.toFixed(2)}`,
      })),
      top_performers: topAuthors.map((a: any) => ({
        author: a.name,
        rating: a.avg_rating.toFixed(1),
        published_works: a.book_count,
      })),
    };
  },
};
