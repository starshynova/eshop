import React, { useEffect, useState } from 'react';
import ProductCardSmall from '../components/ProductCardSmall';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
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
  }, []);


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
