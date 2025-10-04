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
  stock: number;
  description?: string;
  main_photo_url: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
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
          throw new Error(`Failed to load: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
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
        <Loader />
      ) : !term ? (
        <p className="p-8 text-center">
          Enter your query in the search bar above
        </p>
      ) : products.length > 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <h1 className="mb-4 text-2xl">
            Search results: «{term}» ({mode})
          </h1>
          <div className="grid grid-cols-4 gap-y-8 gap-x-8 px-8 mt-8">
            {products.map((product, idx) => (
              <ProductCardSmall
                key={product.id}
                id={product.id.toString()}
                image={product.main_photo_url}
                title={product.title}
                price={product.price}
                stock={product.stock}
                idx={idx}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="p-8 text-center text-2xl uppercase">Nothing found</p>
      )}
    </>
  );
};

export default SearchPage;
