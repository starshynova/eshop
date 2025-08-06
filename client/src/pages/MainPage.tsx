import React, { useEffect, useState } from 'react';
import ProductCardSmall from '../components/ProductCardSmall';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';
import { useSearchParams } from 'react-router-dom';

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  main_photo_url: string;
};

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_BASE_URL}/products`;
        if (subcategory) {
          url += `?subcategory_id=${subcategory}`;
        } else if (category) {
          url += `?category_id=${category}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
        setError("Не удалось загрузить товары. Попробуйте позже.");
      }
    };

    fetchProducts();
  }, [category, subcategory]); // ← теперь эффект зависит от параметров

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div>
      <SearchQueryProvider>
        <Header />
        <div className="flex flex-wrap gap-y-8 justify-around px-8 mt-8 absolute top-[80px]">
          {products.map(product => (
            <ProductCardSmall
              key={product.id}
              image={product.main_photo_url}
              title={product.title}
              price={product.price}
              description={product.description || "Описание пока отсутствует"}
            />
          ))}
        </div>
      </SearchQueryProvider>
    </div>
  );
};

export default MainPage;
