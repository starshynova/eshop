import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
// import ButtonSecond from "./ButtonSecond";
import { ShoppingBag } from "lucide-react";

const CartIconWithBadgeMobile: React.FC = () => {
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="relative inline-block cursor-pointer" onClick={() => navigate("/cart")}>
      <ShoppingBag className="w-6 h-6 text-black" />

      {count > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            flex items-center justify-center
            w-5 h-5
            text-xs font-semibold
            text-white
            bg-black
            rounded-full
            shadow-sm
          "
        >
          {count}
        </span>
      )}
    </div>
    // <ShoppingBag
    //   size={24}
    //   onClick={() => navigate("/cart")}
    //   style={{ cursor: "pointer" }}
    // />
    // <ButtonSecond
    //   onClick={() => navigate("/cart")}
    //   children={`cart (${count})`}
    // />
  );
};

export default CartIconWithBadgeMobile;
