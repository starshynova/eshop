export type ProductDetails = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  main_photo_url?: string;
  category?: { id: number; name: string } | string;
  subcategory?: { id: number; name: string } | string;
};
