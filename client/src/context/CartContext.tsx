import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { API_BASE_URL } from "../config";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";
import { addToLocalCart, getLocalCartCount } from "../utils/localCart";
import { getLocalCart, clearLocalCart } from "../utils/localCart";

type CartContextType = {
  count: number;
  loading: boolean;
  refresh: () => Promise<void>; // reset count from back
  addAndRefresh: (productId: string, stock?: number) => Promise<void>; // add and update count
  setCount: (n: number) => void; // optionally, it is sometimes useful to update instantly
  // mergeGuestCartToUser: () => Promise<void>; // merge guest cart to user cart
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
    if (!isAuthenticated) {
      const handler = () => setCount(getLocalCartCount());
      window.addEventListener("cart-updated", handler);
      handler();
      return () => window.removeEventListener("cart-updated", handler);
    }
  }, [isAuthenticated]);

  // initialize count when mounting and when changing authorization
  useEffect(() => {
  if (isAuthenticated) {
    void refresh();
  }
}, [isAuthenticated]);


  const addAndRefresh = useCallback(
    async (productId: string, stock: number = 1) => {
      if (!isAuthenticated) {
        addToLocalCart(productId, stock); // this will trigger cart-updated
        setCount(getLocalCartCount());
        return;
      }
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
          body: JSON.stringify({ item_id: productId, stock }),
        });
        if (res.ok) {
          await refresh();
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, refresh],
  );

  // const mergeGuestCartToUser = useCallback(async () => {
  //   if (!isAuthenticated) return;

  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   const guestCart = getLocalCart(); // [{ productId, quantity }]
  //   if (!guestCart || guestCart.length === 0) return;

  //   type GuestCartItem = { productId: string; quantity: number };

  //   setLoading(true);
  //   try {
  //     // Send each item to the server
  //     await Promise.all(
  //       guestCart.map((item: GuestCartItem) =>
  //         fetch(`${API_BASE_URL}/carts/add`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             item_id: item.productId,
  //             stock: item.quantity,
  //           }),
  //         }),
  //       ),
  //     );

  //     clearLocalCart();
  //     await refresh();
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isAuthenticated, refresh]);

  if (loading) {
    <Loader />;
  }

  return (
    <CartContext.Provider
      value={{
        count,
        loading,
        refresh,
        addAndRefresh,
        setCount,
        // mergeGuestCartToUser,
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
