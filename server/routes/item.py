from fastapi import APIRouter, Query
from db.connectDB import get_connection
from db.context import get_db_cursor
from services.qdrant_utils import init_image_collection, add_products_with_image_vectors

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
def get_products(
    category_name: str = None,
    subcategory_name: str = None,
    sort: str = Query(default=None)
):
    try:
        with get_db_cursor() as cur:
            base_query = """
                SELECT i.id, i.title, i.price, i.description, i.main_photo_url
                FROM items i
            """
            joins = []
            filters = []
            values = []

            if subcategory_name:
                joins.append("""
                    JOIN item_subcategory isc ON i.id = isc.item_id
                    JOIN subcategory sc ON isc.subcategory_id = sc.id
                """)
                filters.append("sc.subcategory_name = %s")
                values.append(subcategory_name)

            elif category_name:
                joins.append("""
                    JOIN item_category ic ON i.id = ic.item_id
                    JOIN category c ON ic.category_id = c.id
                """)
                filters.append("c.category_name = %s")
                values.append(category_name)

            if joins:
                base_query += " " + " ".join(joins)
            if filters:
                base_query += " WHERE " + " AND ".join(filters)

            # Сортировка
            if sort == "price_asc":
                base_query += " ORDER BY i.price ASC"
            elif sort == "price_desc":
                base_query += " ORDER BY i.price DESC"
            # elif sort == "newest":
            #     base_query += " ORDER BY i.created_at DESC"
            elif sort == "name_asc":
                base_query += " ORDER BY i.title ASC"
            elif sort == "name_desc":
                base_query += " ORDER BY i.title DESC"

            cur.execute(base_query, tuple(values))
            rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4]
            }
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
        with get_db_cursor() as cur:
            cur.execute("""
                        SELECT id, title, price, description, main_photo_url
                        FROM items
                         WHERE title ILIKE %s OR description ILIKE %s;
                        """, (f"%{q}%", f"%{q}%"))

            rows = cur.fetchall()

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
        with get_db_cursor() as cur:
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
        with get_db_cursor() as cur:
                cur.execute("SELECT id, category_name FROM category;")
                category_rows = cur.fetchall()

                # Получим подкатегории
                cur.execute("SELECT id, category_id, subcategory_name FROM subcategory;")
                subcategory_rows = cur.fetchall()

        # Преобразуем в словарь: {category_id: [subcategories]}
        subcategories_by_category = {}
        for sub in subcategory_rows:
            sub_id, cat_id, name = sub
            sub_obj = {"id": sub_id, "subcategory_name": name}
            subcategories_by_category.setdefault(cat_id, []).append(sub_obj)

        # Собираем ответ
        return [
            {
                "id": cat_id,
                "category_name": cat_name,
                "subcategories": subcategories_by_category.get(cat_id, [])
            }
            for cat_id, cat_name in category_rows
        ]
    except Exception as e:
        print(f"❌ Ошибка при получении категорий: {e}")
        return {"error": str(e)}

@router.get("/{item_id}")
def get_product_by_id(item_id: str):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT id, title, price, description, main_photo_url, quantity
                FROM items
                WHERE id = %s;
            """, (item_id,))
            row = cur.fetchone()

        if row:
            return {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4],
                "quantity": row[5]
            }
        else:
            return {"error": f"Product with id {item_id} not found"}
    except Exception as e:
        print(f"❌ Ошибка при получении продукта по ID: {e}")
        return {"error": str(e)}
