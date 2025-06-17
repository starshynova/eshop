from fastapi import APIRouter, Query
from db.connectDB import get_connection

router = APIRouter()

@router.get("/products")

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


@router.get("/products/search")
def search_products(q: str = Query(..., min_length=1)):
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