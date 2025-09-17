import React from "react";
import InputSmall from "./InputSmall";
import Button from "./Button";
import { useState } from "react";
import Loader from "./Loader";
import CustomDialog from "./CustomDialog";
import { API_BASE_URL } from "../config";
import uploadFile from "../utils/uploadFile";
import InputFile from "./InputFile";
import ButtonOutline from "./ButtonOutline";

interface AddProductTableProps {
  onClose?: () => void;
}

const AddProductTable: React.FC<AddProductTableProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    title: "",
    main_photo_url: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleAddProduct = async () => {
    if (
      !form.title ||
      !form.main_photo_url ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.category
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    const productData = {
      title: form.title,
      main_photo_url: form.main_photo_url,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      category_name: form.category,
      subcategory_name: form.subcategory,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Adding product failed");
        throw new Error(`Adding product failed: ${response.status}`);
      }
    } catch (err) {
      setError("Error during adding product. Please try again later.");
    }
    setLoading(false);
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

  return (
    <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-8 uppercase">add product</h2>
      </div>
      <div className="min-w-full border border-gray-300 p-4">
        <table className="min-w-full">
          <tbody>
            <tr className="mt-2">
              <th className="text-left px-4 py-3 w-1/5">Title</th>
              <td className="px-4 py-3">
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
              <th className="text-left px-4 py-3 w-1/5">Photo</th>
              <td className="px-4 py-3">
                {form.main_photo_url ? (
                  <img
                    src={form.main_photo_url}
                    alt={form.title}
                    className="h-32 w-32 object-cover rounded"
                  />
                ) : (
                  <div className="h-0 w-0"></div>
                )}
                <InputFile
                  accept="image/*"
                  onChange={handleFileChange}
                  fileName={uploadedFileName}
                  isUploading={isUploading}
                  error={!!error}
                  errorText={error ?? undefined}
                />
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-3">Description</th>
              <td className="px-4 py-3">
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
              <td className="px-4 py-3">
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
              <td className="px-4 py-3">
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
              <td className="px-4 py-3">
                <InputSmall
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                />
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-3">Subcategory</th>
              <td className="px-4 pt-3">
                <InputSmall
                  type="text"
                  value={form.subcategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subcategory: e.target.value }))
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <Button
          children="Add product"
          className="w-fit"
          onClick={handleAddProduct}
        />
        <ButtonOutline
          children="Back"
          className="w-[200px]"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default AddProductTable;
