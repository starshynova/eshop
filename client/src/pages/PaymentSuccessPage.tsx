import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/CustomDialog";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

// const PaymentSuccessPage: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <CustomDialog
//       isOpen={true}
//       onClose={() => navigate("/")}
//       message="Thank you! The payment was successful. Your order has been placed"
//       isVisibleButton={true}
//       isVisibleButtonOutline={false}
//       buttonTitle="go to the main page"
//       onClickButton={() => navigate("/")}
//     />
//   );
// };
// export default PaymentSuccessPage;

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { refresh } = useCart();

  useEffect(() => {
    // Ждём немного, чтобы Stripe Webhook гарантированно сработал
    const timer = setTimeout(() => {
      refresh(); // Обновляем count и корзину
    }, 2000);
    return () => clearTimeout(timer);
  }, [refresh]);

  return (
    <CustomDialog
      isOpen={true}
      onClose={() => navigate("/")}
      message="Thank you! The payment was successful. Your order has been placed"
      isVisibleButton={true}
      isVisibleButtonOutline={false}
      buttonTitle="go to the main page"
      onClickButton={() => navigate("/")}
    />
  );
};

export default PaymentSuccessPage;