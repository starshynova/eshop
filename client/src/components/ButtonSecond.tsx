import React from "react";

const ButtonSecond: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`self-start bg-[#ffffff] text-[#000000] text-lg font-urbanist pt-2 px-1
  border-b-4 border-transparent hover:border-[#000000] transition-colors ${className}`}
  {...props}
    >
      {children}
    </button>
  );
};

export default ButtonSecond;
