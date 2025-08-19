// import React from "react";
// import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";

// type Order = {
//   id: string;
//   total: number;
//   status: "new" | "paid" | "shipped" | "cancelled";
//   createdAt: string;
// };

// const UserOrdersPanel: React.FC<{ userId: string }> = ({ userId }) => {
//   const [data, setData] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const ac = new AbortController();
//     const run = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await fetch(
//           `/api/orders?userId=${encodeURIComponent(userId)}`,
//           { signal: ac.signal },
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json: Order[] = await res.json();
//         setData(json);
//       } catch (e: any) {
//         if (e.name !== "AbortError") setError(e.message ?? "Ошибка");
//       } finally {
//         setLoading(false);
//       }
//     };
//     run();
//     return () => ac.abort();
//   }, [userId]); // <— второй useEffect, принадлежит вкладке "Заказы"

//   if (loading) return <div>Загружаю заказы…</div>;
//   if (error) return <div className="text-red-600">Ошибка: {error}</div>;

//   return (
//     <ul className="divide-y">
//       {data.map((o) => (
//         <li key={o.id} className="py-3 flex items-center justify-between">
//           <div>
//             <div className="font-medium">Заказ #{o.id}</div>
//             <div className="text-sm text-gray-500">
//               {new Date(o.createdAt).toLocaleString()}
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="font-semibold">€ {o.total.toFixed(2)}</div>
//             <div className="text-sm uppercase tracking-wide">{o.status}</div>
//           </div>
//         </li>
//       ))}
//       {data.length === 0 && (
//         <div className="text-gray-500">Пока нет заказов</div>
//       )}
//     </ul>
//   );
// };

// export default UserOrdersPanel;


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

  if (!orders.length) return <div>You don't have any orders yet.</div>;

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-gray-300 p-6 shadow-md bg-white"
        >
          <div className="mb-4 flex justify-between items-center">
            <span className="text-lg font-bold">Order #{order.id}</span>
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
                    {item.quantity} x € {item.price} 
                  </div>
                </div>
                <div className="font-bold">€ {item.price * item.quantity} </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right font-bold text-lg">
            Total amount: € {order.total_price}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;
