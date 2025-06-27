import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCardSmall';
import API_BASE_URL from './config';
import SearchInputTxt from './components/SearchInputTxt';
import SearchInputImg from './components/SearchInputImg';
// import Example from './components/Header';
import Header from './components/Header';
import SearchInterface from './components/SearchInterface';
import { SearchQueryProvider } from './context/SearchQueryContext';

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  main_photo_url: string;
};

const App: React.FC = () => {
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

  const handleSearch = async (query: string) => {
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка при поиске: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при поиске:", err);
      setError("Не удалось выполнить поиск. Попробуйте позже.");
    }
  };

  const handleSemanticSearch = async (query: string) => {
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/semantic-image-search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка при semantic txt поиске: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при semantic txt поиске:", err);
      setError("Не удалось выполнить semantic поиск. Попробуйте позже.");
    }
  };

  const handleSearchImg = async (imgUrl: string) => {
    setError(null);
    try {
      const payload = { image_url: imgUrl };
      const response = await fetch(
        `${API_BASE_URL}/products/image-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`Ошибка при поиске изображений: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при поиске по изображению:", err);
      setError("Не удалось выполнить поиск по изображению. Попробуйте позже.");
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div>
      <SearchQueryProvider>
      <Header />
      <div className="flex flex-wrap gap-y-8 justify-around px-8 mt-8 fixed top-[80px]">
        {products.map(product => (
          <ProductCard
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

export default App;
