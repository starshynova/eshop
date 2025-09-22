import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/CustomDialog";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CustomDialog
      isOpen={true}
      onClose={() => navigate("/")}
      message="Thank you! The payment was successful. Your order has been placed"
      isVisibleButton={false}
      isVisibleButtonOutline={false}
    />
  );
};

export default PaymentSuccessPage;
