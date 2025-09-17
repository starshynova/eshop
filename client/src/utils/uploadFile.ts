import { API_BASE_URL } from "../config";

export interface UploadFileResult {
  imageUrl: string;
  error: string | null;
}

const uploadFile = async (
  file: File,
  //   API_BASE_URL: string
): Promise<UploadFileResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to upload image");
    }
    const data = await response.json();
    return { imageUrl: data.image_url, error: null };
  } catch (err: any) {
    return {
      imageUrl: "",
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
};

export default uploadFile;
