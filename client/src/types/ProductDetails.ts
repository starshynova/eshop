export type ProductDetails = {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  main_photo_url?: string; // если у товара есть основное фото
  category?: { id: number; name: string } | string;
  subcategory?: { id: number; name: string } | string;
};
