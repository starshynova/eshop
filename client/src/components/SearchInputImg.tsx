const uploadImageToS3 = async (file: File) => {
  // 1. Получить signed URL
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }
    
  const res = await fetch("/api/generate-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name }),
  });

  const { upload_url } = await res.json();

  // 2. Загрузить файл напрямую в S3
  await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // 3. Получаем публичный URL (если бакет открыт)
  const imageUrl = upload_url.split("?")[0];
  return imageUrl;
} catch (error) {
  console.error("Error uploading image to S3:", error);
  throw new Error("Failed to upload image");
};
};

export default uploadImageToS3;