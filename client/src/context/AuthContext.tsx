import React, { createContext, useState, useContext } from "react";
import { API_BASE_URL } from "../config"; 
import { getLocalCart, clearLocalCart } from "../utils/localCart"; 

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>; 
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    const guestCart = getLocalCart();
    if (guestCart.length > 0) {
      await Promise.all(
        guestCart.map((item: any) =>
          fetch(`${API_BASE_URL}/carts/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              item_id: item.productId,
              stock: item.quantity,
            }),
          })
        )
      );
      clearLocalCart();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
