from fastapi import APIRouter
from db.connectDB import get_connection
from services.qdrant_utils import init_qdrant_collection, add_products_to_qdrant

router = APIRouter()

@router.post("/products/init-qdrant")
def init_qdrant():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, title, price, description, main_photo_url FROM items;")
                rows = cur.fetchall()

        products = [
            {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
            for row in rows
        ]

        init_qdrant_collection()
        add_products_to_qdrant(products)

        return {"message": "Продукты добавлены в Qdrant!"}
    except Exception as e:
        return {"error": str(e)}
