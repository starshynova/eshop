import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
// import Loader from "../components/Loader";

export default function useCartCount() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
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
        const response = await fetch(`${API_BASE_URL}/carts/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setCount(0);
          return;
        }
        const data = await response.json();
        if (!cancelled) setCount(Number(data?.count ?? 0));
      } catch {
        if (!cancelled) setCount(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCount();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return { count, loading, isAuthenticated };
}
