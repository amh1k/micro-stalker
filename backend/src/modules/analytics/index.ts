import { Elysia } from "elysia";
import { AnalyticsService } from "./service";
export const analyticsRoutes = new Elysia({ prefix: "/analytics" }).get(
  "/",
  () => {
    try {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        insights: AnalyticsService.getLibraryInsights(),
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
);
