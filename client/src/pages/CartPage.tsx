import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ButtonSecond from "../components/ButtonSecond";
import CustomDialog from "../components/CustomDialog";

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
      <CustomDialog
        isOpen={true}
        onClose={() => navigate("/")}
        message="You need to be logged in to view your cart."
        buttonTitle="Go to login"
        onClickButton={() => navigate("/login")}
      />
    );
  }

  return (
    <SearchQueryProvider>
      <div className="w-full h-screen flex flex-col">
        <Header />
        {loading && <Loader />}

        {cartItems.length === 0 ? (
          <div className="flex justify-center">
            <div className="flex flex-col gap-16 mt-16 ml-16 w-fit">
              <h3 className="text-gray-800 text-3xl font-bold  uppercase">
                your cart is empty
              </h3>
              <Button children="start shopping" onClick={() => navigate("/")} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-[80%] flex flex-col px-16 overflow-y-auto pb-8">
              <div className="border-b-4 border-gray-400 shrink-0">
                <h2 className="text-2xl font-bold mt-8 mb-8 text-left uppercase">
                  your shopping cart
                </h2>
              </div>
              <div className="flex flex-col pt-4">
                <ul className="divide-y-2 divide-gray-200">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="py-4 flex items-center w-full cursor-pointer hover:bg-gray-50 rounded px-2"
                      onClick={() => handleProductCardClick(item.id)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-32 object-cover rounded"
                      />
                      <div className="ml-4 flex-1 h-32">
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex flex-col">
                            <h3 className="text-lg  font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">
                              Price: €{item.price.toFixed(2)}
                            </p>
                            <p className="text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="flex flex-row">
                            <ButtonSecond children="Remove" />
                            <div className=" h-8 w-[2px] bg-black mx-4 "></div>
                            <ButtonSecond children="Edit" />
                          </div>
                        </div>
                      </div>
                      <div className="font-bold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-[20%] bg-[#ededed] px-8 py-8 flex flex-col justify-between">
              <div>
                <div className="border-b-4 border-black">
                  <h2 className="text-xl font-bold mb-8 text-left">
                    Order Summary
                  </h2>
                </div>
                <div className="mt-4 flex justify-end border-b-2 border-black pb-4">
                  <span className="text-lg font-bold text-gray-700">
                    {cartItems
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      )
                      .toFixed(2)}{" "}
                    €
                  </span>
                </div>
              </div>
              <Button
                children="Checkout"
                className="mt-8 w-full"
                onClick={() => navigate("/checkout")}
              />
            </div>
          </div>
        )}
      </div>
    </SearchQueryProvider>
  );
};

export default CartPage;
