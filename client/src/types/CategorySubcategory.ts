export type Subcategory = {
  id: number;
  subcategory_name: string;
};

export type Category = {
  id: number;
  category_name: string;
  subcategories: Subcategory[];
};
