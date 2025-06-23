from fastapi import APIRouter, File, UploadFile
from services.aws_s3_utils import upload_file_to_s3

router = APIRouter()

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    print("✔ Got file:", file.filename, file.content_type)
    url = await upload_file_to_s3(file)
    print("✔ Uploaded to S3, returning URL:", url)
    return {"image_url": url}