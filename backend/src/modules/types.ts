export interface Book {
  id: number;
  title: string;
  author_name: string | null;
  price: number;
  rating: number;
  category_name: string;
  description: string;
  url: string;
}
