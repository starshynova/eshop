import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import type { ProductDetails } from "../types/ProductDetails";
import type { Category } from "../types/CategorySubcategory";
import InputSmall from "./InputSmall";
import ButtonOutline from "./ButtonOutline";
import Loader from "./Loader";
import ProductDetailsTable from "./ProductDetailsTable";
import Button from "./Button";

const AdminProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<ProductDetails[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    main_photo_url: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
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
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setCategoriesError(err.message || "Unknown error");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        title: selectedProduct.title || "",
        main_photo_url: selectedProduct.main_photo_url || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price?.toString() || "",
        stock: selectedProduct.stock?.toString() || "",
        category:
          typeof selectedProduct.category === "string"
            ? selectedProduct.category
            : selectedProduct.category?.name || "",
        subcategory:
          typeof selectedProduct.subcategory === "string"
            ? selectedProduct.subcategory
            : selectedProduct.subcategory?.name || "",
      });
    }
  }, [selectedProduct]);

  const handleAddProduct = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.category
    ) {
      setError("Please fill in all required fields.");
      return;
    }
  };


  if (loading) return <Loader />;

  return (
    <div className="p-4 w-full">
      {!addProductMode && !selectedProduct && products && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <div className="flex flex-row w-full justify-between items-center mb-4">
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
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <h2 className="text-2xl font-bold mb-4 uppercase">add product</h2>
          <table className="min-w-full border border-gray-300">
            <tbody>
              <tr>
                <th className="text-left px-4 py-3 w-1/5">Title</th>
                <td>
                  <InputSmall
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Description</th>
                <td>
                  <InputSmall
                    type="text"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Price</th>
                <td>
                  <InputSmall
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Available Stock</th>
                <td>
                  <InputSmall
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Category</th>
                <td>
                  <InputSmall
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button children="Add product" onClick={() => {}} />
        </div>
      )}
    </div>
  );
};

export default AdminProductsPanel;
