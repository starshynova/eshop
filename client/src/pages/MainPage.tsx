import React, { useEffect, useState } from "react";
import ProductCardSmall from "../components/ProductCardSmall";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { useSearchParams } from "react-router-dom";
import SortMenu from "../components/SortMenu";
import CustomDialog from "../components/CustomDialog";

type Product = {
  id: string;
  title: string;
  price: number;
  description?: string;
  main_photo_url: string;
};

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category_name");
  const subcategory = searchParams.get("subcategory_name");
  const sort = searchParams.get("sort");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();

        if (subcategory) {
          params.append("subcategory_name", subcategory);
        } else if (category) {
          params.append("category_name", category);
        }

        if (sort) {
          params.append("sort", sort);
        }

        const url = `${API_BASE_URL}/products?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Download error: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Unable to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, [category, subcategory, sort]);

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  if (error) {
    return (
      <CustomDialog
        isOpen={true}
        onClose={() => setError(null)}
        message={error}
        isVisibleButton={false}
      />
    );
  }

  return (
    <div>
      <SearchQueryProvider>
        <Header />
        <div className="absolute top-[100px] pb-12">
          <div className="flex justify-between items-center px-8">
            <h1 className="text-3xl font-bold text-left uppercase mt-8">
              {subcategory || category || "All Products"}
            </h1>

            <SortMenu sort={sort as any} handleSortChange={handleSortChange} />
          </div>
          <div className="grid grid-cols-4 gap-y-8 justify-between px-8 mt-8  ">
            {products.map((product, idx) => (
              <ProductCardSmall
                key={product.id}
                id={product.id}
                image={product.main_photo_url}
                title={product.title}
                price={product.price}
                description={
                  product.description || "No description available yet"
                }
                idx={idx}
              />
            ))}
          </div>
        </div>
      </SearchQueryProvider>
    </div>
  );
};

export default MainPage;
