import React from 'react';

type ProductCardProps = {
  image: string;
  title: string;
  price: number;
  description: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ image, title, price, description }) => {
  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <div className="mt-2 font-bold text-indigo-600 text-md">
          €{price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
