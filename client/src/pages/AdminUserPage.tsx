import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AdminUserPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin User Page</h1>
        <p>This is the admin user management page.</p>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default AdminUserPage;
