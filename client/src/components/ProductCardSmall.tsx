import React from 'react';

type ProductCardProps = {
  image: string;
  title: string;
  price: number;
  description: string;
};

const ProductCardSmall: React.FC<ProductCardProps> = ({ image, title, price, description }) => {
  return (
<div className="w-[22%] bg-white flex flex-col border-2 border-red-500 justify-center items-center pb-8">
  <div className="w-[80%] justify-center items-center">
    <img
      src={image}
      alt={title}
      className="w-full object-cover aspect-[3/5]"
    />
  </div>
  <div className="p-4 flex flex-col flex-grow">
    <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
    <div className="mt-2 font-bold text-indigo-600 text-md">
      €{price.toFixed(2)}
    </div>
  </div>
</div>
);

};

export default ProductCardSmall;
