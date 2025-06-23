import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
import os

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = "eu-central-1"
BUCKET_NAME = "e-commerce-img"

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def create_presigned_url(object_name: str, expiration=3600):
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={"Bucket": BUCKET_NAME, "Key": object_name, "ContentType": "image/jpeg"},
            ExpiresIn=expiration,
        )
    except ClientError as e:
        print(e)
        return None
    return response
