import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ButtonSecond from "./ButtonSecond";

const CartIconWithBadge: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <ButtonSecond
      onClick={() => navigate("/cart")}
      children={`cart (${isAuthenticated ? count : 0})`}
    />
  );
};

export default CartIconWithBadge;
