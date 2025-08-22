import React from "react";

const ButtonOutline: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`flex w-fit uppercase bg-[#ffffff] text-[#000000] border-[1px] border-black text-[16px] font-bold  px-8 py-2  rounded-sm hover:bg-[#d0ff00] hover:border-[#d0ff00] transition-colors h-12 justify-center items-center whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonOutline;
