import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Loader from "../components/Loader";

type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  main_photo_url: string;
};

type Order = {
  id: number;
  created_at: string;
  total_price: number;
  items: OrderItem[];
};

const OrderCard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  if (!orders.length) return <div>У вас нет заказов.</div>;

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-gray-300 p-6 shadow-md bg-white"
        >
          <div className="mb-4 flex justify-between items-center">
            <span className="text-lg font-bold">Заказ #{order.id}</span>
            <span className="text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
          </div>
          <div>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-3">
                <img
                  src={item.main_photo_url}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-gray-500">
                    {item.quantity} x {item.price} ₽
                  </div>
                </div>
                <div className="font-bold">{item.price * item.quantity} ₽</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right font-bold text-lg">
            Общая сумма: {order.total_price} ₽
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;
