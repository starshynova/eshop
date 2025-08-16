import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import Header from "../components/Header";
import { API_BASE_URL } from "../config";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Accordion } from "@ark-ui/react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

type ProductProps = {
  id: string;
  title: string;
  price: number;
  description: string;
  main_photo_url: string;
  quantity: number;
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const { addAndRefresh } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching product details: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!id) return;
    await addAndRefresh(id, 1);
  };

  if (!product) {
    return <Loader />;
  }

  return (
    <SearchQueryProvider>
      <Header />
      <div className="flex flex-row w-full px-8 gap-x-12 my-12">
        <img
          src={product.main_photo_url}
          alt={product.title}
          className="w-[45%] object-cover aspect-[3/5]"
        />
        <div className="flex flex-col w-[55%]">
          <h1 className="text-4xl font-bold text-black uppercase">
            {product.title}
          </h1>
          <div className="mt-4 text-black text-xl">€{product.price}</div>
          <p className="text-sm text-gray-400 mt-4">
            Available Quantity: {product.quantity}
          </p>
          <div className="border-t-[1px] border-gray-400 w-full mt-8" />
          <Button
            className="mt-8"
            children="Add to Cart"
            onClick={handleAddToCart}
          />
          <div className="border-t-[1px] border-gray-400 w-full mt-8" />
          <Accordion.Root collapsible>
            <Accordion.Item value="description">
              <Accordion.ItemTrigger className="group w-full my-4 flex flex-row justify-between data-[state=open]:font-bold">
                Description
                <span className="ml-2 flex">
                  <Plus
                    className="block group-data-[state=open]:hidden"
                    size="24px"
                    color="#505050"
                  />
                  <Minus
                    className="hidden group-data-[state=open]:block"
                    size="24px"
                    color="#505050"
                  />
                </span>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent className="my-4">
                {product.description}
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
          <div className="border-t-[1px] border-gray-400 w-full" />
        </div>
      </div>
    </SearchQueryProvider>
  );
};

export default ProductDetails;
