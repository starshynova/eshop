from fastapi import APIRouter
from pydantic import BaseModel
from services.aws_s3_utils import create_presigned_url

router = APIRouter()

class UploadRequest(BaseModel):
    filename: str

@router.post("/generate-upload-url")
def get_upload_url(data: UploadRequest):
    url = create_presigned_url(data.filename)
    return {"upload_url": url}
