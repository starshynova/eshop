import ButtonSecond from "../components/ButtonSecond";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import CustomDialog from "../components/CustomDialog";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
      const { logout } = useAuth();
       const [isOpen, setIsOpen] = useState(false);
       const navigate = useNavigate();

      const handleLogOut = () => {
          logout();
          console.log("User logged out");
          setIsOpen(true);
          setTimeout(() => {
            setIsOpen(false);
            navigate("/");
            }, 2000);
    };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Account Page</h1>
      <p className="text-lg">This is the account page. User details and settings will be displayed here.</p>
      <ButtonSecond
        className="mt-4"
        children="Log Out"
        onClick={() => handleLogOut()} />
        <CustomDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            message="You have successfully logged out."
            isVisibleButton={false}

          />
    </div>
  );
}

export default AccountPage;