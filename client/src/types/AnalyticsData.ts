export type AnalyticsData = {
  total_orders: number;
  total_items_sold: number;
  max_check: number;
  min_check: number;
  avg_check: number;
  top_10_products: { id: string; title: string; sold: number }[];
  unsold_products: { id: string; title: string }[];
  low_stock: { id: string; title: string; stock: number }[];
  sales_by_category: { category: string; revenue: number }[];
  sales_by_subcategory: { subcategory: string; revenue: number }[];
};
