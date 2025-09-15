import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { AnalyticsData } from "../types/AnalyticsData";
import { API_BASE_URL } from "../config";
import Loader from "./Loader";

const COLORS = [
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#e74c3c",
  "#8e44ad",
  "#2ecc71",
  "#e67e22",
  "#e84393",
  "#636e72",
  "#fdcb6e",
];

const AdminOrderAnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="p-4 w-full">
      {/* Карточки с метриками */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex flex-col bg-white border-2 border-gray-300 rounded-sm p-6 min-w-[200px]">
          <span className="text-base text-gray-700 uppercase font-semibold">
            Total orders
          </span>
          <span className="text-2xl font-bold">{data.total_orders}</span>
        </div>
        <div className="flex flex-col bg-white border-2 border-gray-300 rounded-sm p-6 min-w-[200px]">
          <span className="text-base text-gray-700 uppercase font-semibold">
            Products sold
          </span>
          <span className="text-2xl font-bold">{data.total_items_sold}</span>
        </div>
        <div className="flex flex-col bg-white border-2 border-gray-300 rounded-sm p-6 min-w-[200px]">
          <span className="text-base text-gray-700 uppercase font-semibold">
            Average bill
          </span>
          <span className="text-2xl font-bold">
            € {data.avg_check.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col bg-white border-2 border-gray-300 rounded-sm p-6 min-w-[200px]">
          <span className="text-base text-gray-700 uppercase font-semibold">
            Maximum bill
          </span>
          <span className="text-2xl font-bold">
            € {data.max_check.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col bg-white border-2 border-gray-300 rounded-sm p-6 min-w-[200px]">
          <span className="text-base text-gray-700 uppercase font-semibold">
            Minimum bill
          </span>
          <span className="text-2xl font-bold">
            € {data.min_check.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Топ-10 товаров */}
      <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm mb-8 bg-white">
        <h2 className="text-2xl font-bold uppercase mb-4">
          Top 10 best-selling products
        </h2>
        {/* <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-bold text-black uppercase">Title</th>
                <th className="px-4 py-3 text-left text-base font-bold text-black uppercase">Продано (шт)</th>
              </tr>
            </thead>
            <tbody>
              {data.top_10_products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm text-black">{p.title}</td>
                  <td className="px-4 py-3 text-sm text-black">{p.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <div className="w-full h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top_10_products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="title"
                angle={-15}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#1abc9c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm mb-8 bg-white">
        <h2 className="text-2xl font-bold uppercase mb-4">Sales by category</h2>
        {/* <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-bold text-black uppercase">Категория</th>
                <th className="px-4 py-3 text-left text-base font-bold text-black uppercase">Выручка (€)</th>
              </tr>
            </thead>
            <tbody>
              {data.sales_by_category.map((cat) => (
                <tr key={cat.category}>
                  <td className="px-4 py-3 text-sm text-black">{cat.category}</td>
                  <td className="px-4 py-3 text-sm text-black">{cat.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.sales_by_category}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.sales_by_category.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[280px] bg-white border-2 border-gray-300 p-6 rounded-sm">
          <h2 className="text-lg font-bold mb-3 uppercase">
            Products with minimal stock (less than 5)
          </h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Title</th>
                <th className="px-4 py-2 text-left font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 min-w-[280px] bg-white border-2 border-gray-300 p-6 rounded-sm">
          <h2 className="text-lg font-bold mb-3 uppercase">
            Products without sales
          </h2>
          <ul className="list-disc ml-6">
            {data.unsold_products.map((p) => (
              <li key={p.id} className="py-1">
                {p.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderAnalyticsPanel;
