import { Elysia, t } from "elysia";
import { BookService } from "./service";
export const bookRoutes = new Elysia({ prefix: "/books" })
  .get("/", ({ query }: { query: Record<string, string | undefined> }) => {
    const page = query.page ? parseInt(query.page as string) : 1;
    return {
      success: true,
      data: BookService.getPaginatedBooks(page),
    };
  })
  .get(
    "/search",
    ({ query }: { query: Record<string, string | undefined> }) => {
      const q = query.q as string;
      return {
        success: true,
        results: BookService.searchBooks(q),
      };
    },
  )
  .get("/:id", ({ params: { id } }: { params: { id: string } }) => {
    try {
      return {
        success: true,
        data: BookService.getBookDetails(parseInt(id)),
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  });
