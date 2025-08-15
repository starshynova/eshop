import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCardSmall from "../components/ProductCardSmall";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import Loader from "../components/Loader";

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
  const term = searchParams.get("term") || "";
  const mode = searchParams.get("mode") ?? "regular";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!term) return;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const url = new URL(`${API_BASE_URL}/products/search`);
        url.searchParams.set("term", term);
        url.searchParams.set("mode", mode);

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
      }
    };
    fetchProducts();
  }, [term, mode]);

  return (
    <>
      <Header />

      {loading ? (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
          <Loader />
        </div>
      ) : !term ? (
        <p className="p-8 text-center">
          Введите запрос в поисковую строку выше.
        </p>
      ) : products.length > 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <h1 className="mb-4 text-2xl">
            Результаты поиска: «{term}» ({mode})
          </h1>
          <div className="flex flex-wrap gap-y-8 justify-around px-8 mt-4 w-full">
            {products.map((product) => (
              <ProductCardSmall
                key={product.id}
                id={product.id.toString()}
                image={product.main_photo_url}
                title={product.title}
                price={product.price}
                description={product.description || "Описание пока отсутствует"}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="p-8 text-center">Ничего не найдено.</p>
      )}
    </>
  );
};

export default SearchPage;
