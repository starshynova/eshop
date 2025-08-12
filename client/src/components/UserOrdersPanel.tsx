import React from "react";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

type Order = {
  id: string;
  total: number;
  status: "new" | "paid" | "shipped" | "cancelled";
  createdAt: string;
};

const UserOrdersPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: ac.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Order[] = await res.json();
        setData(json);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message ?? "Ошибка");
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => ac.abort();
  }, [userId]); // <— второй useEffect, принадлежит вкладке "Заказы"

  if (loading) return <div>Загружаю заказы…</div>;
  if (error) return <div className="text-red-600">Ошибка: {error}</div>;

  return (
    <ul className="divide-y">
      {data.map((o) => (
        <li key={o.id} className="py-3 flex items-center justify-between">
          <div>
            <div className="font-medium">Заказ #{o.id}</div>
            <div className="text-sm text-gray-500">
              {new Date(o.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">€ {o.total.toFixed(2)}</div>
            <div className="text-sm uppercase tracking-wide">{o.status}</div>
          </div>
        </li>
      ))}
      {data.length === 0 && (
        <div className="text-gray-500">Пока нет заказов</div>
      )}
    </ul>
  );
};

export default UserOrdersPanel;
