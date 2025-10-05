import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { API_BASE_URL } from "../config";
import { useAuth } from "./AuthContext";
import {
  addToLocalCartWithStockCheck,
  getLocalCartCount,
  getLocalCart,
  clearLocalCart,
} from "../utils/localCart";
import Loader from "../components/Loader";

type CartContextType = {
  count: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addAndRefresh: (
    productId: string,
    quantity?: number,
  ) => Promise<{ success: boolean; error?: any } | undefined>;
  setCount: (n: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(getLocalCartCount());
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/carts/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setCount(0);
        return;
      }
      const data = await res.json();
      setCount(Number(data?.count ?? 0));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const syncCartAndRefresh = async () => {
      if (!isAuthenticated) {
        setCount(getLocalCartCount());
        return;
      }

      const token = localStorage.getItem("token");
      const guestCart = getLocalCart();

      if (guestCart.length > 0 && token) {
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
                quantity: item.quantity,
              }),
            }),
          ),
        );
        clearLocalCart();
      }
      await refresh();
    };

    void syncCartAndRefresh();
  }, [isAuthenticated]);

  const addAndRefresh = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!isAuthenticated) {
        const result = await addToLocalCartWithStockCheck(productId, quantity);
        if (!result || !result.success) return result;
        setCount(getLocalCartCount());
        return { success: true };
      }

      const token = localStorage.getItem("token");
      if (!token) return { success: false, error: "User not authenticated" };

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/carts/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ item_id: productId, quantity: quantity }),
        });
        if (!res.ok) {
          const data = await res.json();
          console.log("data: ", data);
          return {
            success: false,
            error: data.detail || "Error adding product",
          };
        }
        await refresh();
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || "Unknown error" };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, refresh],
  );

  if (loading) {
    return (
      <CartContext.Provider
        value={{ count, loading, refresh, addAndRefresh, setCount }}
      >
        {children}
        {loading && <Loader />}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider
      value={{
        count,
        loading,
        refresh,
        addAndRefresh,
        setCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
