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
  idx: number;
};

const ProductCardSmall: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  description,
  idx,
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

  const cardStyle = {
    marginRight: (idx + 1) % 4 === 0 ? 0 : "auto",
    marginLeft: idx % 4 === 0 ? 0 : "auto",
  } as React.CSSProperties;

  return (
    <div
      className="flex flex-col gap-y-4 w-[90%] mx-auto bg-gradient-to-t from-[#f8f8f8f8] to-[#ecececec] border-none "
      style={cardStyle}
    >
      <button
        className="w-full h-full flex flex-col cursor-pointer justify-center items-center"
        onClick={handleProductCardClick}
      >
        <div className="w-[80%] justify-center items-center">
          <img
            src={image}
            alt={title}
            className="w-full object-cover aspect-[1/1]"
          />
        </div>
      </button>
      <div className="flex flex-row items-start">
        <div className="px-4 flex flex-col flex-grow text-left">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {/* <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </p> */}
          <div className="mt-2 font-bold text-indigo-600 text-md">
            €{price.toFixed(2)}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          children="Add to Cart"
          className="min-w-fit"
        />
      </div>
    </div>
  );
};

export default ProductCardSmall;
