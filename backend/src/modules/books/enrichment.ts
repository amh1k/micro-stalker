// src/modules/books/enrichment.ts
export const EnrichmentService = {
  findAuthor: async (title: string) => {
    try {
      const response = await fetch(
        `${process.env.AUTHOR_API}${encodeURIComponent(title)}`,
      );
      const data = await response.json();
      const authors = data.items?.[0]?.volumeInfo?.authors;
      return authors ? authors.join(", ") : "Unknown Author";
    } catch (err) {
      return "Unknown Author";
    }
  },
};
