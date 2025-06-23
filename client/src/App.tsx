import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCardSmall';
import API_BASE_URL from './config';
import SearchInputTxt from './components/SearchInputTxt';
import SearchInputImg from './components/SearchInputImg';

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
        console.log("API_BASE_URL:", API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          console.log("Response status:", response.status);
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        console.log("Данные с сервера:", data);
      } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
        setError("Не удалось загрузить товары. Попробуйте позже.");
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (query: string) => {
  console.log('Поиск:', query);
  setError(null); // Сброс ошибки

  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Ошибка при поиске: ${response.status}`);
    }

    const data = await response.json();
    setProducts(data);
    console.log('Результаты поиска:', data);
  } catch (err) {
    console.error("Ошибка при поиске:", err);
    setError("Не удалось выполнить поиск. Попробуйте позже.");
    }
  };

  const handleSemanticSearch = async (query: string) => {
  console.log('Semantic txt Поиск:', query);
  setError(null); // Сброс ошибки

  try {
    const response = await fetch(`${API_BASE_URL}/products/semantic-image-search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Ошибка при semantic txt поиске: ${response.status}`);
    }

    const data = await response.json();
    setProducts(data);
    console.log('Результаты semantic txt поиска:', data);
  } catch (err) {
    console.error("Ошибка при semantic txt поиске:", err);
    setError("Не удалось выполнить semantic поиск. Попробуйте позже.");
    }
  };


  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const handleSearchImg = async (imgUrl: string) => {
    // console.log('Поиск по изображению:', file.name);
    const encodedUrl = encodeURIComponent(imgUrl);
    const response = await fetch(`${API_BASE_URL}/products/semantic-image-search?q=${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
     if (!response.ok) {
      throw new Error(`Ошибка при поиске: ${response.status}`);
    }
    const data = await response.json();
    setProducts(data);
  };

  return (
    <div>
    <SearchInputTxt placeholder='Search...' onSearch={handleSearch}/>
    <SearchInputTxt placeholder='Semantic search...' onSearch={handleSemanticSearch}/>
    <SearchInputImg onSearchImg={(imgUrl) => {
      console.log("Uploaded to S3: ", imgUrl);
      handleSearchImg(imgUrl);
    }} />
    <div className="flex flex-wrap gap-y-8 justify-around px-8">
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
    </div>
  );
};

export default App;
