import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/CustomDialog";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <CustomDialog
      isOpen={true}
      onClose={() => navigate("/")}
      message="Congratulations! You have successfully paid for your order"
      isVisibleButton={false}
    />
  );
};

export default PaymentSuccessPage;
