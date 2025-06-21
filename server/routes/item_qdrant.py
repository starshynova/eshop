from fastapi import APIRouter, Query
from services.qdrant_utils import search_similar_images, search_similar_images_by_text
from pydantic import BaseModel

router = APIRouter()

class ImageSearchRequest(BaseModel):
    image_url: str

@router.post("/products/image-search")
def image_search(request: ImageSearchRequest):
    try:
        results = search_similar_images(request.image_url)
        return results
    except Exception as e:
        return {"error": str(e)}

@router.get("/products/semantic-image-search")
def semantic_image_search(q: str = Query(..., min_length=1)):
    try:
        results = search_similar_images_by_text(q)
        return results
    except Exception as e:
        return {"error": str(e)}
