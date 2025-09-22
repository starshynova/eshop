from fastapi import APIRouter, Query, Body, HTTPException
from db.context import get_db_cursor
from uuid import uuid4
# from services.qdrant_utils import init_image_collection, add_products_with_image_vectors

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
                SELECT i.id, i.title, i.price, i.description, i.main_photo_url, i.stock
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

            if sort == "price_asc":
                base_query += " ORDER BY i.price ASC"
            elif sort == "price_desc":
                base_query += " ORDER BY i.price DESC"
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
                "main_photo_url": row[4],
                "stock": row[5]
            }
            for row in rows
        ]
    except Exception as e:
        print(f"Error receiving products: {e}")
        return {"error": str(e)}


@router.get("/all-products")
def get_products(
    category_name: str = None,
    subcategory_name: str = None,
):
    try:
        with get_db_cursor() as cur:
            base_query = """
                SELECT
                    i.id,
                    i.title,
                    i.price,
                    i.description,
                    i.main_photo_url,
                    i.stock,
                    c.id AS category_id,
                    c.category_name,
                    sc.id AS subcategory_id,
                    sc.subcategory_name
                FROM items i
                LEFT JOIN item_category ic ON i.id = ic.item_id
                LEFT JOIN category c ON ic.category_id = c.id
                LEFT JOIN item_subcategory isc ON i.id = isc.item_id
                LEFT JOIN subcategory sc ON isc.subcategory_id = sc.id
            """

            filters = []
            values = []

            if subcategory_name:
                filters.append("sc.subcategory_name = %s")
                values.append(subcategory_name)
            elif category_name:
                filters.append("c.category_name = %s")
                values.append(category_name)

            if filters:
                base_query += " WHERE " + " AND ".join(filters)

            cur.execute(base_query, tuple(values))
            rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4],
                "stock": row[5],
                "category": {
                    "id": row[6],
                    "name": row[7]
                } if row[6] else None,
                "subcategory": {
                    "id": row[8],
                    "name": row[9]
                } if row[8] else None,
            }
            for row in rows
        ]
    except Exception as e:
        print(f"Error receiving products: {e}")
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
        print(f"Error receiving products in search: {e}")
        return {"error": str(e)}

# @router.post("/init-image-vectors")
# def init_image_vectors():
#     try:
#         with get_db_cursor() as cur:
#                 cur.execute("SELECT id, title, price, description, main_photo_url FROM items;")
#                 rows = cur.fetchall()

#         products = [
#             {"id": row[0], "title": row[1], "price": float(row[2]), "description": row[3], "main_photo_url": row[4]}
#             for row in rows
#         ]

#         init_image_collection()
#         add_products_with_image_vectors(products)

#         return {"message": "Products added to Qdrant with image vectors!"}
#     except Exception as e:
#         return {"error": str(e)}


@router.get("/categories")
def get_categories():
    try:
        with get_db_cursor() as cur:
                cur.execute("SELECT id, category_name FROM category;")
                category_rows = cur.fetchall()

                cur.execute("SELECT id, category_id, subcategory_name FROM subcategory;")
                subcategory_rows = cur.fetchall()

        subcategories_by_category = {}
        for sub in subcategory_rows:
            sub_id, cat_id, name = sub
            sub_obj = {"id": sub_id, "subcategory_name": name}
            subcategories_by_category.setdefault(cat_id, []).append(sub_obj)

        return [
            {
                "id": cat_id,
                "category_name": cat_name,
                "subcategories": subcategories_by_category.get(cat_id, [])
            }
            for cat_id, cat_name in category_rows
        ]
    except Exception as e:
        print(f"Error getting categories: {e}")
        return {"error": str(e)}

# @router.get("/{item_id}")
# def get_product_by_id(item_id: str):
#     try:
#         with get_db_cursor() as cur:
#             cur.execute("""
#                 SELECT id, title, price, description, main_photo_url, stock
#                 FROM items
#                 WHERE id = %s;
#             """, (item_id,))
#             row = cur.fetchone()
#
#         if row:
#             return {
#                 "id": row[0],
#                 "title": row[1],
#                 "price": float(row[2]),
#                 "description": row[3],
#                 "main_photo_url": row[4],
#                 "stock": row[5]
#             }
#         else:
#             return {"error": f"Product with id {item_id} not found"}
#     except Exception as e:
#         print(f"❌ Error getting product by id: {e}")
#         return {"error": str(e)}

@router.get("/{item_id}")
def get_product_by_id(item_id: str):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT
                    i.id, i.title, i.price, i.description, i.main_photo_url, i.stock,
                    c.id as category_id, c.category_name,
                    sc.id as subcategory_id, sc.subcategory_name
                FROM items i
                LEFT JOIN item_category ic ON i.id = ic.item_id
                LEFT JOIN category c ON ic.category_id = c.id
                LEFT JOIN item_subcategory isc ON i.id = isc.item_id
                LEFT JOIN subcategory sc ON isc.subcategory_id = sc.id
                WHERE i.id = %s
            """, (item_id,))
            row = cur.fetchone()

        if row:
            return {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4],
                "stock": row[5],
                "category": {
                    "id": row[6],
                    "name": row[7]
                } if row[6] else None,
                "subcategory": {
                    "id": row[8],
                    "name": row[9]
                } if row[8] else None,
            }
        else:
            return {"error": f"Product with id {item_id} not found"}
    except Exception as e:
        print(f"❌ Error getting product by id: {e}")
        return {"error": str(e)}


@router.patch("/{item_id}")
def update_product_details(
        item_id: str,
        data: dict = Body(...)
):
    try:
        with get_db_cursor() as cur:
            # Проверим что продукт существует
            cur.execute("SELECT id FROM items WHERE id = %s;", (item_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail=f"Product with id {item_id} not found")

            update_fields = []
            values = []

            allowed_fields = ["title", "description", "price", "stock",  "main_photo_url"]
            if "photo" in data:
                data["main_photo_url"] = data["photo"]
            for key in allowed_fields:
                if key in data:
                    update_fields.append(f"{key} = %s")
                    values.append(data[key])

            if update_fields:
                cur.execute(
                    f"""
                        UPDATE items
                        SET {", ".join(update_fields)}
                        WHERE id = %s
                        """,
                    tuple(values + [item_id])
                )

            if "category_id" in data:
                cur.execute("DELETE FROM item_category WHERE item_id = %s", (item_id,))
                cur.execute("INSERT INTO item_category (item_id, category_id) VALUES (%s, %s)",
                            (item_id, data["category_id"]))

            if "subcategory_id" in data:
                cur.execute("DELETE FROM item_subcategory WHERE item_id = %s", (item_id,))
                cur.execute("INSERT INTO item_subcategory (item_id, subcategory_id) VALUES (%s, %s)",
                            (item_id, data["subcategory_id"]))

            cur.execute("""
                    SELECT
                        i.id, i.title, i.price, i.description, i.main_photo_url, i.stock,
                        c.id as category_id, c.category_name,
                        sc.id as subcategory_id, sc.subcategory_name
                    FROM items i
                    LEFT JOIN item_category ic ON i.id = ic.item_id
                    LEFT JOIN category c ON ic.category_id = c.id
                    LEFT JOIN item_subcategory isc ON i.id = isc.item_id
                    LEFT JOIN subcategory sc ON isc.subcategory_id = sc.id
                    WHERE i.id = %s
                """, (item_id,))
            row = cur.fetchone()

        if row:
            return {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4],
                "stock": row[5],
                "category": {
                    "id": row[6],
                    "name": row[7]
                } if row[6] else None,
                "subcategory": {
                    "id": row[8],
                    "name": row[9]
                } if row[8] else None,
            }
        else:
            raise HTTPException(status_code=404, detail=f"Product with id {item_id} not found")

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error updating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{item_id}")
def delete_product(item_id: str):

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1 FROM items WHERE id = %s", (item_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Product not found.")
            cur.execute("DELETE FROM items WHERE id = %s", (item_id,))
        return {"detail": "Product deleted successfully."}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete user")


@router.post("/")
def create_product(data: dict = Body(...)):
    try:
        required_fields = ["title", "price", "description", "stock", "category_name"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=422, detail=f"Field '{field}' is required")

        item_id = str(uuid4())
        title = data["title"]
        price = data["price"]
        description = data["description"]
        stock = data["stock"]
        main_photo_url = data.get("main_photo_url") or data.get("photo") or None
        category_name = data["category_name"]
        subcategory_name = data.get("subcategory_name")

        with get_db_cursor() as cur:
            cur.execute("SELECT id FROM category WHERE category_name = %s", (category_name,))
            cat_row = cur.fetchone()
            if cat_row:
                category_id = cat_row[0]
            else:
                category_id = str(uuid4())
                cur.execute(
                    "INSERT INTO category (id, category_name) VALUES (%s, %s)",
                    (category_id, category_name)
                )

            subcategory_id = None
            if subcategory_name:
                cur.execute("SELECT id FROM subcategory WHERE subcategory_name = %s", (subcategory_name,))
                subcat_row = cur.fetchone()
                if subcat_row:
                    subcategory_id = subcat_row[0]
                else:
                    subcategory_id = str(uuid4())
                    cur.execute(
                        "INSERT INTO subcategory (id, subcategory_name) VALUES (%s, %s)",
                        (subcategory_id, subcategory_name)
                    )

            cur.execute("""
                INSERT INTO items (id, title, price, description, main_photo_url, stock)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (item_id, title, price, description, main_photo_url, stock))

            cur.execute(
                "INSERT INTO item_category (item_id, category_id) VALUES (%s, %s)",
                (item_id, category_id)
            )

            if subcategory_id:
                cur.execute(
                    "INSERT INTO item_subcategory (item_id, subcategory_id) VALUES (%s, %s)",
                    (item_id, subcategory_id)
                )

            # --- Let's get the complete object to return ---
            cur.execute("""
                SELECT
                    i.id, i.title, i.price, i.description, i.main_photo_url, i.stock,
                    c.id as category_id, c.category_name,
                    sc.id as subcategory_id, sc.subcategory_name
                FROM items i
                LEFT JOIN item_category ic ON i.id = ic.item_id
                LEFT JOIN category c ON ic.category_id = c.id
                LEFT JOIN item_subcategory isc ON i.id = isc.item_id
                LEFT JOIN subcategory sc ON isc.subcategory_id = sc.id
                WHERE i.id = %s
            """, (item_id,))
            row = cur.fetchone()

        if row:
            return {
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "description": row[3],
                "main_photo_url": row[4],
                "stock": row[5],
                "category": {
                    "id": row[6],
                    "name": row[7]
                } if row[6] else None,
                "subcategory": {
                    "id": row[8],
                    "name": row[9]
                } if row[8] else None,
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create product")

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch")
async def get_products_batch(ids: dict = Body(...)):
    id_list = ids.get("ids", [])
    if not id_list:
        return {"products": []}
    placeholders = ','.join(['%s'] * len(id_list))
    query = f"""
        SELECT
            i.id, i.title, i.price, i.description, i.main_photo_url, i.stock,
            c.id as category_id, c.category_name,
            sc.id as subcategory_id, sc.subcategory_name
        FROM items i
        LEFT JOIN item_category ic ON i.id = ic.item_id
        LEFT JOIN category c ON ic.category_id = c.id
        LEFT JOIN item_subcategory isc ON i.id = isc.item_id
        LEFT JOIN subcategory sc ON isc.subcategory_id = sc.id
        WHERE i.id IN ({placeholders})
    """
    with get_db_cursor() as cur:
        cur.execute(query, tuple(id_list))
        rows = cur.fetchall()

    products = [
        {
            "id": row[0],
            "title": row[1],
            "price": float(row[2]),
            "description": row[3],
            "main_photo_url": row[4],
            "stock": row[5],
            "category": {
                "id": row[6],
                "name": row[7]
            } if row[6] else None,
            "subcategory": {
                "id": row[8],
                "name": row[9]
            } if row[8] else None,
        }
        for row in rows
    ]
    return {"products": products}