import React from "react";

const ButtonSecond: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`self-start h-8 bg-transparent text-[#000000] text-lg font-urbanist  px-1 justify-center uppercase
  border-b-2 border-transparent hover:border-[#000000] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonSecond;
