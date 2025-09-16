import React, { useState, useEffect } from "react";
import CustomDialog from "./CustomDialog";
import { API_BASE_URL } from "../config";
import type { ProductDetails } from "../types/ProductDetails";
import type { Category } from "../types/CategorySubcategory";
import InputSmall from "./InputSmall";
import InputFile from "./InputFile";
import ButtonOutline from "./ButtonOutline";
import Loader from "./Loader";
import ProductDetailsTable from "./ProductDetailsTable";

const AdminProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<ProductDetails[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [successDeleteDialogOpen, setSuccessDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [addProductMode, setAddProductMode] = useState(false);
  // const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const handleEditProduct = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      try {
        if (!selectedProduct) {
          setError("No product selected for editing.");
          return;
        }
        const response = await fetch(
          `${API_BASE_URL}/products/${selectedProduct.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...form,
              price: Number(form.price),
              stock: Number(form.stock),
            }),
          },
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to update product");
        }
        setEditMode(false);
        setSelectedProduct((prev) =>
          prev
            ? {
                ...prev,
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
              }
            : null,
        );
        setProducts((prev) =>
          prev
            ? prev.map((p) =>
                p.id === selectedProduct.id
                  ? {
                      ...p,
                      ...form,
                      price: Number(form.price),
                      stock: Number(form.stock),
                    }
                  : p,
              )
            : null,
        );
      } catch (err: any) {
        setError(err.message || "Failed to update product");
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!selectedProduct) {
        setError("No product selected for deleting.");
        return;
      }
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/products/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete product");
      }
      setSuccessDeleteDialogOpen(true);
      setIsDeleteDialogOpen(false);
      setProducts((prev) =>
        prev ? prev.filter((p) => p.id !== selectedProduct.id) : null,
      );
      setSelectedProduct(null);
      setTimeout(() => {
        setSuccessDeleteDialogOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadedFileName("");
      return;
    }
    const selectedFile = files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to upload image");
      }
      const data = await response.json();
      setForm((f) => ({ ...f, main_photo_url: data.image_url }));
      setUploadedFileName(selectedFile.name);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUploadedFileName("");
    } finally {
      setIsUploading(false);
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
      {/* {!addProductMode && !editMode && selectedProduct && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
         
           <ProductDetailsTable product={selectedProduct}>
      <div className="flex flex-row gap-4 col-span-2">
        <ButtonOutline className="m-4" onClick={() => setIsDeleteDialogOpen(true)}>
          delete product
        </ButtonOutline>
        <ButtonOutline className="m-4" onClick={() => setEditMode(true)}>
          edit product
        </ButtonOutline>
        <ButtonOutline
                className="m-4"
                onClick={() => {
                  setSelectedProduct(null);
                  setEditMode(false);
                }}
              >
                back
              </ButtonOutline>
      </div>
    </ProductDetailsTable>
        </div>
      )} */}

      {!addProductMode && selectedProduct && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <ProductDetailsTable
            product={selectedProduct}
            token={token}
            onUpdate={(updatedProduct) => {
              setSelectedProduct(updatedProduct);
              setProducts((prev) =>
                prev
                  ? prev.map((p) =>
                      p.id === updatedProduct.id ? updatedProduct : p,
                    )
                  : null,
              );
            }}
            onDelete={(deletedId) => {
              setProducts((prev) =>
                prev ? prev.filter((p) => p.id !== deletedId) : null,
              );
              setSelectedProduct(null);
            }}
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
        </div>
      )}
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

export default AdminProductsPanel;
