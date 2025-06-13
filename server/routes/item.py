from fastapi import APIRouter

from db.connectDB import get_connection

router = APIRouter()

@router.get("/products")
def get_products():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM items;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
        for row in rows
    ]
