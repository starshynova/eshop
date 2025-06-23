import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path
from uuid import uuid4



env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = "eu-central-1"
BUCKET_NAME = "e-commerce-temporary-img"

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# def create_presigned_url(object_name: str, expiration=3600):
#     try:
#         response = s3_client.generate_presigned_url(
#             "put_object",
#             Params={"Bucket": BUCKET_NAME, "Key": object_name, "ContentType": "image/jpeg"},
#             ExpiresIn=expiration,
#         )
#     except ClientError as e:
#         print(e)
#         return None
#     return response

async def upload_file_to_s3(file):
    # Уникальное имя файла
    file_ext = file.filename.split('.')[-1]
    filename = f"{uuid4()}.{file_ext}"

    # Чтение содержимого файла
    file_content = await file.read()

    # Загрузка в S3
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=filename,
        Body=file_content,
        ContentType=file.content_type,
    )

    # Публичный URL
    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
    return image_url