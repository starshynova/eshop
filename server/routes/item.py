from fastapi import APIRouter, Query
from db.connectDB import get_connection
from services.qdrant_utils import init_image_collection, add_products_with_image_vectors

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
def get_products():
    try:
        print("Запрос /products получен!")
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM items;")
                rows = cur.fetchall()

        return [
            {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
            for row in rows
        ]
    except Exception as e:
        print(f"❌ Ошибка при получении продуктов: {e}")
        return {"error": str(e)}


@router.get("/search")
def search_products(
    q: str = Query(..., alias="term", min_length=1),
    mode: str = Query("regular")
):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
                    SELECT id, title, price, description, main_photo_url
                    FROM items
                     WHERE title ILIKE %s OR description ILIKE %s;
                    """, (f"%{q}%", f"%{q}%"))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        return [
        {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
        for row in rows
        ]
    except Exception as e:
        print(f"❌ Ошибка при получении продуктов в поиске: {e}")
        return {"error": str(e)}

@router.post("/init-image-vectors")
def init_image_vectors():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, title, price, description, main_photo_url FROM items;")
                rows = cur.fetchall()

        products = [
            {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
            for row in rows
        ]

        init_image_collection()
        add_products_with_image_vectors(products)

        return {"message": "Продукты добавлены в Qdrant с image-векторами!"}
    except Exception as e:
        return {"error": str(e)}

@router.get("/categories")
def get_categories():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM category;")
                rows = cur.fetchall()

            return [
                {"id": row[0], "category_name": row[1]}
                for row in rows
            ]
    except Exception as e:
        print(f"❌ Ошибка при получении категорий: {e}")
        return {"error": str(e)}