import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import Welcome from "./components/Welcome";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserPage from "./pages/AdminUserPage";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/users/:userId" element={<AccountPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/user/:userId" element={<AdminUserPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
