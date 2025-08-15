import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import Header from "../components/Header";
import { API_BASE_URL } from "../config";
import Loader from "../components/Loader";
import Button from "../components/Button";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  main_photo_url: string;
  quantity: number;
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

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

  if (!product) {
    return <Loader />;
  }

  return (
    <SearchQueryProvider>
      <Header />
      <div className="flex flex-row w-[80%] gap-x-12 mt-8 mb-8">
        <img
          src={product.main_photo_url}
          alt={product.title}
          className="w-[40%] object-cover aspect-[3/5]"
        />
        <div className="flex flex-col w-[60%]">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4 font-bold text-indigo-600 text-xl">
            €{product.price}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Available Quantity: {product.quantity}
          </p>
          <div className="mt-6">
            <Button>Add to Cart</Button>
          </div>
        </div>
      </div>
    </SearchQueryProvider>
  );
};

export default ProductDetails;
