import React, {useState} from "react";
import InputSmall from "./InputSmall";
import InputFile from "./InputFile";
import ButtonOutline from "./ButtonOutline";
import CustomDialog from "./CustomDialog";
import type { ProductDetails } from "../types/ProductDetails";


interface ProductDetailsTableProps {
  product: ProductDetails;
  children?: React.ReactNode;
  token?: string;
  onUpdate?: (updated: ProductDetails) => void;
  onDelete?: (id: string) => void;
  onClose?: () => void;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  product,
  token,
  onUpdate,
  onDelete,
  onClose,
  children,
}) => {
  if (!product) return null;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
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
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Функция для сохранения изменений (API PATCH)
  const handleSave = async () => {
    if (!token || !onUpdate) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
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
      setEditMode(false);
      onUpdate({
        ...product,
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    }
  };

  // Функция для удаления (API DELETE)
  const handleDelete = async () => {
    if (!token || !onDelete) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete product");
      }
      setIsDeleteDialogOpen(false);
      onDelete(product.id);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  // Обработка загрузки фото (если надо)
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

      const response = await fetch("/api/upload-image", {
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

//   return (
//     <div className="overflow-x-auto w-full">
//       <table className="min-w-full border border-gray-300">
//         <tbody>
//           <tr>
//             <th className="text-left px-4 py-3 w-1/5">ID</th>
//             <td className="px-4 py-3">{product.id}</td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Title</th>
//             <td className="px-4 py-3">{product.title}</td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Photo</th>
//             <td className="px-4 py-3">
//               <img
//                 src={product.main_photo_url}
//                 alt={product.title}
//                 className="h-48"
//               />
//             </td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Description</th>
//             <td className="px-4 py-3">{product.description}</td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Price</th>
//             <td className="px-4 py-3">{product.price}</td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Available Stock</th>
//             <td className="px-4 py-3">{product.stock}</td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Category</th>
//             <td className="px-4 py-3">
//               {typeof product.category === "string"
//                 ? product.category
//                 : product.category?.name || ""}
//             </td>
//           </tr>
//           <tr>
//             <th className="text-left px-4 py-3">Subcategory</th>
//             <td className="px-4 py-3">
//               {typeof product.subcategory === "string"
//                 ? product.subcategory
//                 : product.subcategory?.name || ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       {children}
//       {/* {onClose && (
//         <button
//           className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       )} */}
//     </div>
//   );
 return (
    <div className="w-full border border-gray-300 rounded-sm p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 uppercase">Product details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
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
                      setForm((f) => ({ ...f, title: e.target.value }))
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
                      setForm((f) => ({ ...f, description: e.target.value }))
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
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                ) : (
                  product.price
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
                      setForm((f) => ({ ...f, stock: e.target.value }))
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
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  />
                ) : typeof product.category === "string"
                  ? product.category
                  : product.category?.name || ""}
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
                      setForm((f) => ({ ...f, subcategory: e.target.value }))
                    }
                  />
                ) : typeof product.subcategory === "string"
                  ? product.subcategory
                  : product.subcategory?.name || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* КНОПКИ */}
      {!editMode && (
        <div className="flex gap-4 mt-4">
          <ButtonOutline onClick={() => setEditMode(true)}>
            Edit product
          </ButtonOutline>
          <ButtonOutline onClick={() => setIsDeleteDialogOpen(true)}>
            Delete product
          </ButtonOutline>
          {onClose && (
            <ButtonOutline onClick={onClose}>Back</ButtonOutline>
          )}
        </div>
      )}
      {editMode && (
        <div className="flex gap-4 mt-4">
          <ButtonOutline onClick={() => setEditMode(false)}>
            Cancel
          </ButtonOutline>
          <ButtonOutline onClick={handleSave}>
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


