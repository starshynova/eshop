import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

type ProductCardProps = {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
};

const ProductCardSmall: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  description,
}) => {
  const navigate = useNavigate();
  const { addAndRefresh } = useCart();

  const handleProductCardClick = () => {
    if (!id) {
      console.error("Product ID is undefined!");
      return;
    }
    navigate(`/products/${id}`);
  };

  const handleAddToCart = async () => {
    if (!id) return;
    await addAndRefresh(id, 1);
  };

  return (
    <div className="flex flex-col gap-y-4 w-[22%] bg-white border-2 border-red-500 pb-8">
      <button
        className="w-full h-full flex flex-col cursor-pointer justify-center items-center"
        onClick={handleProductCardClick}
      >
        <div className="w-[80%] justify-center items-center">
          <img
            src={image}
            alt={title}
            className="w-full object-cover aspect-[3/5]"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
          <div className="mt-2 font-bold text-indigo-600 text-md">
            €{price.toFixed(2)}
          </div>
        </div>
      </button>
      <div className="w-full flex justify-center">
        <Button onClick={handleAddToCart} children="Add to Cart" />
      </div>
    </div>
  );
};

export default ProductCardSmall;
