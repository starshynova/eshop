import React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`uppercase  bg-[#000000] text-[#ffffff] text-lg  px-8 py-2  rounded-sm hover:bg-[#d0ff00] hover:text-[#000000] transition-colors h-12 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
