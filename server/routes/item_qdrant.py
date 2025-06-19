from fastapi import APIRouter, Query ,Body
from services.qdrant_utils import search_similar_products, search_similar_images

router = APIRouter()

@router.get("/products/semantic-search")
def semantic_search(q: str = Query(..., min_length=1)):
    try:
        results = search_similar_products(q)
        return results
    except Exception as e:
        return {"error": str(e)}

@router.post("/products/image-search")
def image_search(image_url: str = Body(..., embed=True)):
    try:
        results = search_similar_images(image_url)
        return results
    except Exception as e:
        return {"error": str(e)}