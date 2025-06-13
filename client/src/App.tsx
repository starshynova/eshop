// // import './index.css'

// export default function App() {
//   return (
//     <div className="bg-red-500 text-white text-2xl p-6 text-center rounded">
//       Test Tailwind
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCardSmall';
import API_BASE_URL from './config';

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image: string;
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

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.name}
          price={product.price}
          description="Описание пока отсутствует"
        />
      ))}
    </div>
  );
};

export default App;
