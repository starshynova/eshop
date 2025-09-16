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
import type { ProductDetails } from "../types/ProductDetails";
import { API_BASE_URL } from "../config";
import Loader from "./Loader";
import ButtonOutline from "./ButtonOutline";
import ProductDetailsTable from "./ProductDetailsTable";

const COLORS = [
  "#8e44ad",
  "#fdcb6e",
  "#2ecc71",
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#e74c3c",
  "#e67e22",
  "#e84393",
];

const AdminOrderAnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    if (selectedProductId) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/products/${selectedProductId}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product details");
          }
          const productData = await response.json();
          setSelectedProduct(productData);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [selectedProductId]);

  if (!data) return <Loader />;

  if (!selectedProduct) {
    return (
      <div className="p-4 w-full">
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

        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm mb-8 bg-white">
          <h2 className="text-2xl font-bold uppercase mb-4">
            Top 10 best-selling products
          </h2>
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
                <Bar
                  dataKey="sold"
                  fill="#8e44ad"
                  cursor="pointer"
                  onClick={(_, index) =>
                    setSelectedProductId(data.top_10_products[index].id)
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm mb-8 bg-white">
          <h2 className="text-2xl font-bold uppercase mb-4">
            Sales by category
          </h2>
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
              products with minimal stock (less than 5)
            </h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-2">{product.title}</td>
                    <td className="px-4 py-2">{product.stock}</td>
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
              {data.unsold_products.map((product) => (
                <li key={product.id} className="py-1">
                  {product.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 w-full">
      <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm bg-white">
        <h2 className="text-2xl font-bold mb-4 uppercase">Product Details</h2>
        <ProductDetailsTable
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
          }}
        >
          <div className="flex flex-row gap-4 col-span-2">
            <ButtonOutline
              className="m-4"
              onClick={() => {
                setSelectedProduct(null);
              }}
            >
              back to analytics
            </ButtonOutline>
          </div>
        </ProductDetailsTable>
      </div>
      {/* {error && (
        <CustomDialog
          isOpen={true}
          onClose={() => setError(null)}
          message={error}
          isVisibleButton={false}
        />
      )}
      <CustomDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        message={`Are you sure you want to delete product "${selectedProduct ? selectedProduct.title : ""}"?`}
        buttonTitle="delete"
        buttonOutlineTitle="cancel"
        onClickButton={handleDeleteProduct}
        isVisibleButton={true}
      />
      <CustomDialog
        isOpen={successDeleteDialogOpen}
        onClose={() => setSuccessDeleteDialogOpen(false)}
        message={`You have successfully deleted product "${selectedProduct ? selectedProduct.title : ""}"`}
        isVisibleButton={false}
      /> */}
    </div>
  );
};

export default AdminOrderAnalyticsPanel;
