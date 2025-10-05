import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import type { ProductDetails } from "../types/ProductDetails";
import ButtonOutline from "./ButtonOutline";
import Loader from "./Loader";
import ProductDetailsTable from "./ProductDetailsTable";
import AddProductTable from "./AddProductTable";
import CustomDialog from "./CustomDialog";

const AdminProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<ProductDetails[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addProductMode, setAddProductMode] = useState(false);

  const token = localStorage.getItem("token");

  if (!token) {
    setError("No token found in localStorage");
    return null;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/all-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) setError("Failed to fetch products");
        const data: ProductDetails[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <CustomDialog
        isOpen={true}
        onClose={() => setError(null)}
        message={error}
        isVisibleButton={false}
      />
    );
  }

  return (
    <div className="p-4 w-full">
      {!addProductMode && !selectedProduct && products && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <div className="flex flex-row w-full justify-between items-start mb-4">
            <h2 className="text-2xl font-bold uppercase">products list</h2>
            <ButtonOutline
              className="mb-4"
              children="Add new product"
              onClick={() => {
                setAddProductMode(true);
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr className="border-b border-gray-300 w-full">
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    id
                  </th>
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    photo
                  </th>
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    title
                  </th>
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    price
                  </th>
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    category
                  </th>
                  <th className="min-w-[180px] px-4 py-3 text-left text-base font-bold text-black uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm text-black">
                      {product.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      <img
                        src={product.main_photo_url}
                        alt={product.title}
                        className="w-16  object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {product.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      € {product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-900">
                      View more
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!addProductMode && selectedProduct && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <ProductDetailsTable
            productId={selectedProduct.id}
            token={token}
            onClose={() => setSelectedProduct(null)}
          />
        </div>
      )}

      {addProductMode && !selectedProduct && (
        <div>
          <AddProductTable onClose={() => setAddProductMode(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminProductsPanel;
