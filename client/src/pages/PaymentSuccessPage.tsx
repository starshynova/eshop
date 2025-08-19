import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/CustomDialog";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
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
