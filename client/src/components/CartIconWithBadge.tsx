import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const CartIconWithBadge: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative flex w-10 h-10 flex-none items-center justify-center rounded-full bg-white"
      aria-label="Cart"
    >
      <ShoppingCartIcon
        aria-hidden="true"
        className="size-6 text-[#cf3232] hover:text-indigo-600"
      />
      {isAuthenticated && count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#cf3232] text-white text-xs font-semibold flex items-center justify-center"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CartIconWithBadge;
