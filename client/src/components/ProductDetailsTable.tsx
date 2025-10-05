import React, { useState, useEffect } from "react";
import InputSmall from "./InputSmall";
import InputFile from "./InputFile";
import ButtonOutline from "./ButtonOutline";
import CustomDialog from "./CustomDialog";
import { API_BASE_URL } from "../config";
import Loader from "./Loader";
import uploadFile from "../utils/uploadFile";

interface ProductDetailsTableProps {
  productId: string | null;
  token?: string;
  onClose?: () => void;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  productId,
  token,
  onClose,
}) => {
  const [product, setProduct] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setForm(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title,
      main_photo_url: product.main_photo_url,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category:
        typeof product.category === "string"
          ? product.category
          : product.category?.name || "",
      subcategory:
        typeof product.subcategory === "string"
          ? product.subcategory
          : product.subcategory?.name || "",
    });
  }, [product, editMode]);

  const handleEditProduct = async () => {
    if (!token || !form) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
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
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update product");
      }
      const updated = await res.json();
      setProduct(updated);
      setEditMode(false);
      setForm({
        title: updated.title,
        main_photo_url: updated.main_photo_url,
        description: updated.description,
        price: String(updated.price),
        stock: String(updated.stock),
        category:
          typeof updated.category === "string"
            ? updated.category
            : updated.category?.name || "",
        subcategory:
          typeof updated.subcategory === "string"
            ? updated.subcategory
            : updated.subcategory?.name || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete product");
      }
      setIsDeleteDialogOpen(false);
      if (onClose) onClose();
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
    const result = await uploadFile(selectedFile);
    if (result.error) {
      setError(result.error);
      setUploadedFileName("");
    } else {
      setForm((f: any) => ({ ...f, main_photo_url: result.imageUrl }));
      setUploadedFileName(selectedFile.name);
      setError("");
    }
    setIsUploading(false);
  };

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
  if (!product || !form) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 uppercase">Product details</h2>
      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-300">
          <div className="p-4">
            <tbody>
              <tr>
                <th className="text-left px-4 py-3 w-1/5">ID</th>
                <td className="px-4 py-3">{product.id}</td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          title: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    product.title
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Photo</th>
                <td className="px-4 py-3">
                  <img
                    src={form.main_photo_url}
                    alt={product.title}
                    className="h-48"
                  />
                  {editMode && (
                    <InputFile
                      accept="image/*"
                      onChange={handleFileChange}
                      fileName={uploadedFileName}
                      isUploading={isUploading}
                      error={!!error}
                      errorText={error ?? undefined}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Description</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    product.description
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Price</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          price: e.target.value,
                        }))
                      }
                    />
                  ) : product.price !== undefined && product.price !== null ? (
                    `€ ${Number(product.price).toFixed(2)}`
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Stock</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          stock: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    product.stock
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Category</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          category: e.target.value,
                        }))
                      }
                    />
                  ) : typeof product.category === "string" ? (
                    product.category
                  ) : (
                    product.category?.name || ""
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-3">Subcategory</th>
                <td className="px-4 py-3">
                  {editMode ? (
                    <InputSmall
                      type="text"
                      value={form.subcategory}
                      onChange={(e) =>
                        setForm((f: any) => ({
                          ...f,
                          subcategory: e.target.value,
                        }))
                      }
                    />
                  ) : typeof product.subcategory === "string" ? (
                    product.subcategory
                  ) : (
                    product.subcategory?.name || ""
                  )}
                </td>
              </tr>
            </tbody>
          </div>
        </table>
      </div>
      {!editMode && (
        <div className="flex gap-4 mt-8">
          <ButtonOutline onClick={() => setEditMode(true)}>
            Edit product
          </ButtonOutline>
          <ButtonOutline onClick={() => setIsDeleteDialogOpen(true)}>
            Delete product
          </ButtonOutline>
          {onClose && <ButtonOutline onClick={onClose}>Back</ButtonOutline>}
        </div>
      )}
      {editMode && (
        <div className="flex gap-4 mt-8">
          <ButtonOutline onClick={() => setEditMode(false)}>
            Cancel
          </ButtonOutline>
          <ButtonOutline onClick={handleEditProduct}>
            Save changes
          </ButtonOutline>
        </div>
      )}
      {error && (
        <CustomDialog
          isOpen={!!error}
          onClose={() => setError(null)}
          message={error}
          isVisibleButton={false}
        />
      )}
      <CustomDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        message={`Are you sure you want to delete product "${product.title}"?`}
        buttonTitle="Delete"
        buttonOutlineTitle="Cancel"
        onClickButton={handleDelete}
        isVisibleButton={true}
      />
    </div>
  );
};

export default ProductDetailsTable;
