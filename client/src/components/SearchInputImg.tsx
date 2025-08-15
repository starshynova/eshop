import React, { useState } from "react";
import { API_BASE_URL } from "../config";

type SearchButtonProps = {
  onSearchImg: (fileUrl: string) => void;
};

const SearchInputImg: React.FC<SearchButtonProps> = ({ onSearchImg }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadImageToBackend = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.image_url;
      onSearchImg(imageUrl);
    } catch (err) {
      console.error("Ошибка при загрузке на сервер:", err);
    }
  };

  return (
    <div className="flex items-center space-x-2 w-[50%] max-w-md mx-auto p-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full h-[32px] px-[20px] py-[20px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={uploadImageToBackend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInputImg;
