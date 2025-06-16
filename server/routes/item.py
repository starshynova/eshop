from fastapi import APIRouter

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

