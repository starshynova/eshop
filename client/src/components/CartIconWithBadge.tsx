import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ButtonSecond from "./ButtonSecond";

const CartIconWithBadge: React.FC = () => {
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <ButtonSecond
      onClick={() => navigate("/cart")}
      children={`cart (${count})`}
    />
  );
};

export default CartIconWithBadge;
