import React, { useEffect, useState } from "react";
import ProductCardSmall from "../components/ProductCardSmall";
import API_BASE_URL from "../config";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { useSearchParams } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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
  }, [category, subcategory, sort]); // добавили sort

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams); // это обновит URL и триггернет useEffect
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div>
      <SearchQueryProvider>
        <Header />
        <div className="flex mt-8 h-[40px] px-16 items-center justify-end ">
          <Menu as="div" className="relative inline-block text-left ml-auto">
            <MenuButton className="px-4 py-1 bg-white rounded text-sm font-semibold">
              Sort:{" "}
              {
                {
                  price_asc: "Price: Low to High",
                  price_desc: "Price: High to Low",
                  name_asc: "Name: A-Z",
                  name_desc: "Name: Z-A",
                  default: "By default",
                  undefined: "By default",
                  null: "By default",
                }[sort ?? "undefined"]
              }
            </MenuButton>

            <MenuItems className="absolute mt-2 right-0 origin-top-right bg-white border rounded shadow w-40 z-10">
              {[
                { label: "By default", value: "default" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Name: A-Z", value: "name_asc" },
                { label: "Name: Z-A", value: "name_desc" },
              ].map(({ label, value }) => (
                <MenuItem key={value}>
                  <button
                    onClick={() => handleSortChange(value)}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      sort === value ? "font-semibold text-blue-600" : ""
                    }`}
                  >
                    {label}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="flex flex-wrap gap-y-8 justify-around px-8 mt-8 absolute top-[140px]">
          {products.map((product) => (
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
