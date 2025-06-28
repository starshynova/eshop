import React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-[#aef3ff] text-[#000000] text-lg px-4 py-2 rounded-lg hover:bg-[#999999] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;