import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API_BASE_URL from "../config";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

type CartContextType = {
  count: number;
  loading: boolean;
  refresh: () => Promise<void>; // перезагрузить count с бэка
  addAndRefresh: (productId: string, quantity?: number) => Promise<void>; // добавить и обновить count
  setCount: (n: number) => void; // опционально, иногда удобно мгновенно обновить
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
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

  // Инициализируем count при монтировании и при смене авторизации
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addAndRefresh = useCallback(
    async (productId: string, quantity: number = 1) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/carts/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ item_id: productId, quantity }),
        });

        if (res.ok) {
          await refresh();
        } else {
          try {
            const err = await res.json();
            console.error("Add to cart failed:", err);
          } catch {
            console.error("Add to cart failed: HTTP", res.status);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  return (
    <CartContext.Provider
      value={{ count, loading, refresh, addAndRefresh, setCount }}
    >
      {loading && <Loader />}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
