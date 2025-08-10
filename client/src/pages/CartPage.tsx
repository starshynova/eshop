import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleProductCardClick = (productId: string) => {
    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/carts/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch cart items: ${res.status}`);
        }

        const data = await res.json();
        setCartItems(data.items || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to view your cart
        </h1>
        <p className="text-gray-600">
          You need to be logged in to access your cart.
        </p>
      </div>
    );
  }

  return (
    <SearchQueryProvider>
      <Header />
      {loading && <Loader />}

      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex items-center w-full cursor-pointer hover:bg-gray-50 rounded px-2"
                  onClick={() => handleProductCardClick(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">
                      €{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <span className="text-lg font-bold">
                Total: €
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )
                  .toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </SearchQueryProvider>
  );
};

export default CartPage;
