import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCardSmall from '../components/ProductCardSmall';
import API_BASE_URL from '../config';
import Header from '../components/Header';


interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  main_photo_url: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
//   const q = searchParams.get('q') || '';
  const term = searchParams.get('term') || '';
  const mode = searchParams.get('mode') ?? 'regular';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!term) return;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const url = new URL(`${API_BASE_URL}/products/search`);
        url.searchParams.set('term', term);
        url.searchParams.set('mode', mode);
        
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      } finally {
        setLoading(false);
      } }
    fetchProducts();   
  }, [term, mode]);

  return (
    <>
    <Header />
      {!term ? (
        <p>Введите запрос в поисковую строку выше.</p>
      ) : loading ? (
        // <p>Загрузка результатов по «{q}»…</p>
        <p>Загрузка результатов по «{term}»…</p>
      ) : (
        <>
          {/* <h1>Результаты поиска: «{q}»</h1> */}
          <div className="w-full flex flex-col items-center justify-center">
          <h1>Результаты поиска: «{term}» ({mode})</h1>
          {products.length > 0 ? (
           <div className="flex flex-wrap gap-y-8 justify-around px-8 mt-8 absolute top-[80px] w-full">
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
          ) : (
            <p>Ничего не найдено.</p>
          )}</div>
        </>
      )}
    </>
  );
}

export default SearchPage;