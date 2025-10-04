import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from "../config";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ButtonSecond from "../components/ButtonSecond";
import CustomDialog from "../components/CustomDialog";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import { getLocalCart, setLocalCart } from "../utils/localCart";
import { jwtDecode } from "jwt-decode";

type CartItem = {
  id: string;
  title: string;
  price: number;
  stock: number;
  quantity: number;
  main_photo_url: string;
};

const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(1);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const { refresh } = useCart();
  const token = localStorage.getItem("token");
  const stripePromise = loadStripe(`${STRIPE_PUBLISHABLE_KEY}`);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      if (isAuthenticated) {
        try {
          const res = await fetch(`${API_BASE_URL}/carts/items`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok)
            throw new Error(`Failed to fetch cart items: ${res.status}`);
          const data = await res.json();
          setCartItems(data.items || []);
        } catch (err: any) {
          setError(err.message || "Unknown error");
          setCartItems([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const localCart = getLocalCart();
        if (!localCart.length) {
          setCartItems([]);
          setLoading(false);
          return;
        }
        const ids = localCart.map(
          (i: { productId: string; quantity: number }) => i.productId,
        );

        const res = await fetch(`${API_BASE_URL}/products/batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!res.ok) throw new Error("Failed to fetch products info");
        const data = await res.json();

        const fullCart: CartItem[] = data.products.map((p: any) => {
          const qty =
            localCart.find((x: any) => x.productId === p.id)?.quantity || 1;
          return {
            id: p.id,
            title: p.title,
            price: p.price,
            stock: p.stock,
            quantity: qty,
            main_photo_url: p.main_photo_url,
          };
        });

        setCartItems(fullCart);
        console.log("fullCart:", cartItems);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    if (!isAuthenticated) {
      const handler = () => fetchCart();
      window.addEventListener("cart-updated", handler);
      return () => window.removeEventListener("cart-updated", handler);
    }
  }, [isAuthenticated]);

  const handleProductCardClick = (productId: string) => {
    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!isAuthenticated) {
      let localCart = getLocalCart();
      localCart = localCart.filter(
        (i: { productId: string; quantity: number }) => i.productId !== itemId,
      );
      setLocalCart(localCart);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      await refresh();
    } catch (err: any) {
      setError(err.message || "Unknown error");
      console.error(err);
    }
  };

  const handleEditClick = (item: CartItem) => {
    setEditingId(item.id);
    setEditStock(item.quantity);
  };

  const handleEditSave = async (itemId: string) => {
    if (!isAuthenticated) {
      let localCart = getLocalCart();
      localCart = localCart.map((i: { productId: string; quantity: number }) =>
        i.productId === itemId ? { ...i, quantity: editStock } : i,
      );
      setLocalCart(localCart);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: editStock } : item,
        ),
      );
      setEditingId(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: editStock }),
      });
      if (!res.ok) throw new Error("Failed to update stock");
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, stock: editStock } : item,
        ),
      );
      setEditingId(null);
      await refresh();
    } catch (err: any) {
      setError(err.message || "Unknown error");
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    console.log("Token before payment:", localStorage.getItem("token"));

    if (!token) {
      setError("User token not found. Please login again.");
      return;
    }
    type MyJwtPayload = {
      user_id: string;
    };

    const decoded = jwtDecode<MyJwtPayload>(token);
    console.log("Decoded user_id:", decoded.user_id);
    const user_id = decoded.user_id;

    const res = await fetch(`${API_BASE_URL}/payments/create-payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total,
        metadata: { user_id },
      }),
    });

    if (!res.ok) {
      setError("Error during payment initiation");
      return;
    }
    const data = await res.json();
    console.log("Stripe clientSecret:", data.clientSecret);
    setClientSecret(data.clientSecret);
  };

  if (error) {
    return (
      <CustomDialog
        isOpen={true}
        onClose={() => {
          setError(null);
          navigate("/cart");
        }}
        message={error}
        isVisibleButton={false}
      />
    );
  }

  if (loading) {
    return <Loader />;
  }

  console.log("cartItems:", cartItems);

  return (
    <SearchQueryProvider>
      <Header />
      <div className="absolute top-[100px] w-full h-[calc(100vh-80px)] flex flex-col px-8">
        {cartItems.length === 0 ? (
          <div className="flex justify-center">
            <div className="flex flex-col gap-16 mt-16  w-fit">
              <h3 className="text-black text-3xl font-bold  uppercase">
                your cart is empty
              </h3>
              <Button children="start shopping" onClick={() => navigate("/")} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-[80%] flex flex-col pr-8 overflow-y-auto pb-8">
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
                        src={item.main_photo_url}
                        alt={item.title}
                        className="h-32 object-cover rounded"
                      />
                      <div className="ml-4 flex-1 h-32">
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex flex-col">
                            <h3 className="text-lg  font-semibold">
                              {item.title}
                            </h3>
                            {/* <p className="text-gray-600">
                              Price: €{item.price.toFixed(2)}
                            </p>
                            <p className="text-gray-600">Stock: {item.stock}</p> */}
                            <p className="text-gray-600">
                              Price:{" "}
                              {item.stock === 0 ? (
                                <span className="text-red-500 font-bold">
                                  Out of stock
                                </span>
                              ) : (
                                <>€{item.price.toFixed(2)}</>
                              )}
                            </p>
                            <p className="text-gray-600">Stock: {item.stock}</p>
                          </div>
                          <div className="flex flex-row items-center">
                            <ButtonSecond
                              className="text-sm"
                              children="Remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteItemId(item.id);
                              }}
                            />
                            <div className=" h-4 w-[1px] bg-black mx-4 "></div>
                            {editingId === item.id ? (
                              <>
                                <input
                                  type="number"
                                  min={1}
                                  value={editStock}
                                  onChange={(e) =>
                                    setEditStock(Number(e.target.value))
                                  }
                                  className="w-16 border-black border-[1px] rounded-sm px-2"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex gap-x-4 px-4">
                                  <ButtonSecond
                                    className="text-sm"
                                    children="save"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditSave(item.id);
                                    }}
                                  />
                                  <ButtonSecond
                                    className="text-sm"
                                    children="cancel"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(null);
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <ButtonSecond
                                className="text-sm"
                                children="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(item);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold">
                        {item.stock === 0 ? (
                          <span className="text-red-500 font-bold">
                            Out of stock
                          </span>
                        ) : (
                          <>€{(item.price * item.quantity).toFixed(2)}</>
                        )}
                        {/* €{(item.price * item.stock).toFixed(2)} */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-[20%] bg-[#ededed] px-8 py-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="border-b-4 border-black">
                  <h2 className="text-xl font-bold mb-8 text-left">
                    Order Summary
                  </h2>
                </div>
                <div className="mt-4 flex justify-end border-b-2 border-black pb-4">
                  <span className="text-lg font-bold text-gray-700">
                    {cartItems
                      .filter((item) => item.stock > 0)
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      )
                      .toFixed(2)}{" "}
                    €
                  </span>
                </div>
              </div>

              {isAuthenticated ? (
                clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutForm />
                  </Elements>
                ) : (
                  <Button
                    children="Checkout"
                    className="mt-8 w-full"
                    onClick={handleCheckout}
                  />
                )
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckoutForm />
                </Elements>
              ) : (
                <Button
                  children="Login to Checkout"
                  className="mt-8 w-full"
                  onClick={() => navigate("/login")}
                />
              )}
            </div>
          </div>
        )}

        <CustomDialog
          isOpen={!!deleteItemId}
          onClose={() => setDeleteItemId(null)}
          message="Are you sure you want to delete this item from your cart?"
          buttonTitle="Delete"
          buttonOutlineTitle="Cancel"
          onClickButton={() => {
            if (deleteItemId) handleRemoveItem(deleteItemId);
            setDeleteItemId(null);
          }}
          isVisibleButton={true}
        />
      </div>
    </SearchQueryProvider>
  );
};

export default CartPage;
