import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import CustomDialog from "../components/CustomDialog";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { API_BASE_URL } from "../config";
import { LogOut } from "lucide-react";
import { Tabs } from "@ark-ui/react/tabs";
import UserInfoPanel from "../components/UserInfoPanel";
import UserOrdersPanel from "../components/UserOrdersPanel";
import type { UserDetails } from "../types/UserDetails";
import ButtonOutline from "../components/ButtonOutline";

type TabKey = "profile" | "orders";

const AccountPage: React.FC = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const [active, setActive] = useState<TabKey>("profile");

  const handleLogOut = () => {
    logout();
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }
        const data = await response.json();

        const userData: UserDetails = {
          id: data.id,
          role: data.role,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          post_code: data.post_code,
          city: data.city,
        };

        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <SearchQueryProvider>
      <div className="w-full h-screen flex flex-col">
        <Header />
        <div className="w-full absolute top-[140px] flex flex-col px-8 items-center justify-center">
          <div className="w-full  flex flex-row items-center justify-between pt-8 pb-12">
            <h1 className="text-3xl font-bold mb-4 uppercase">
              Welcome, {userDetails ? userDetails.first_name : "client"}
            </h1>
            <ButtonOutline
              className="mt-4 flex items-center gap-2"
              onClick={() => handleLogOut()}
            >
              <LogOut size={16} />
              Log Out
            </ButtonOutline>
            <CustomDialog
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              message="You have successfully logged out."
              isVisibleButton={false}
            />
          </div>
          <div className="flex w-full border-b-[1px] border-b-gray-400 items-center justify-center">
            <Tabs.Root
              value={active}
              onValueChange={(e) => setActive(e.value as TabKey)}
            >
              <Tabs.List className="flex gap-2 px-4">
                <Tabs.Trigger
                  value="profile"
                  className="self-start h-8 bg-transparent text-[#000000] text-xl  px-5 justify-center  
                  border-b-2 border-b-transparent hover:text-[#505050] transition-colors data-[selected]:border-b-[#000000] "
                >
                  Profile
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="orders"
                  className="self-start h-8 bg-transparent text-[#000000] text-xl px-5 justify-center  
                  border-b-2 border-b-transparent hover:text-[#505050] transition-colors data-[selected]:border-b-[#000000]"
                >
                  Orders
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>
          <div className="w-full flex flex-row justify-between p-8">
            {active === "profile" && <UserInfoPanel userId={userId ?? ""} />}
            {active === "orders" && <UserOrdersPanel />}
          </div>
        </div>
      </div>
    </SearchQueryProvider>
  );
};

export default AccountPage;
