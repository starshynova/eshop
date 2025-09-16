import React, { useState } from "react";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { Tabs } from "@ark-ui/react/tabs";
import CustomDialog from "../components/CustomDialog";
import AdminUsersPanel from "../components/AdminUsersPanel";
import AdminProductsPanel from "../components/AdminProductsPanel";
import AdminOrderAnalyticsPanel from "../components/AdminOrderAnalyticsPanel";

type TabKey = "users" | "products" | "orderAnalytics";

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<TabKey>("users");
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  if (!token) {
    setError("No token found in localStorage");
    return null;
  }

  return (
    <SearchQueryProvider>
      <Header />
      <div className="flex flex-col w-full px-8 gap-x-12 my-12 absolute top-[80px]">
        <h1 className="text-3xl font-bold mb-4 text-center uppercase">
          Admin Dashboard
        </h1>

        <div className="flex w-full border-b-[1px] border-b-gray-400 items-center justify-center mt-8">
          <Tabs.Root
            value={active}
            onValueChange={(e) => setActive(e.value as TabKey)}
          >
            <Tabs.List className="flex gap-2 px-4">
              <Tabs.Trigger
                value="users"
                className="self-start h-8 bg-transparent text-[#000000] text-xl  px-5 justify-center  
                      border-b-2 border-b-transparent hover:text-[#505050] transition-colors data-[selected]:border-b-[#000000] "
              >
                Users
              </Tabs.Trigger>
              <Tabs.Trigger
                value="products"
                className="self-start h-8 bg-transparent text-[#000000] text-xl px-5 justify-center  
                      border-b-2 border-b-transparent hover:text-[#505050] transition-colors data-[selected]:border-b-[#000000]"
              >
                Products
              </Tabs.Trigger>
              <Tabs.Trigger
                value="orderAnalytics"
                className="self-start h-8 bg-transparent text-[#000000] text-xl px-5 justify-center  
                      border-b-2 border-b-transparent hover:text-[#505050] transition-colors data-[selected]:border-b-[#000000]"
              >
                Order analytics
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
        <div className="w-full flex p-8">
          {active === "users" && <AdminUsersPanel />}
          {active === "products" && <AdminProductsPanel />}
          {active === "orderAnalytics" && <AdminOrderAnalyticsPanel />}
        </div>
      </div>
      {error && (
        <CustomDialog
          isOpen={true}
          onClose={() => setError(null)}
          message={"Error: " + error}
          isVisibleButton={false}
        />
      )}
    </SearchQueryProvider>
  );
};

export default AdminDashboard;
