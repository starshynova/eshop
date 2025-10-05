from fastapi import APIRouter, HTTPException
import pandas as pd
from db.context import get_db_cursor

router = APIRouter(prefix="/analytics", tags=["analytics"])

def fetch_table_as_df(table_name: str) -> pd.DataFrame:
    with get_db_cursor() as cur:
        cur.execute(f"SELECT * FROM {table_name};")
        columns = [desc[0] for desc in cur.description]
        data = cur.fetchall()
    return pd.DataFrame(data, columns=columns)

orders = fetch_table_as_df("orders")
order_items = fetch_table_as_df("order_item")
items = fetch_table_as_df("items")
category = fetch_table_as_df("category")
item_category = fetch_table_as_df("item_category")
subcategory = fetch_table_as_df("subcategory")
item_subcategory = fetch_table_as_df("item_subcategory")

@router.get("/orders")
def get_orders_analytics():
    try:
        with get_db_cursor() as cur:
            # 1. Общее количество заказов
            cur.execute("SELECT COUNT(DISTINCT id) FROM orders;")
            total_orders = cur.fetchone()[0]

            # 2. Количество проданных товаров (штук)
            cur.execute("SELECT COALESCE(SUM(quantity),0) FROM order_item;")
            total_items_sold = cur.fetchone()[0]

            # 3. Сумма заказов по каждому order_id (для чеков)
            cur.execute("""
                SELECT order_id, SUM(quantity * price_at_purchase) as total
                FROM order_item
                GROUP BY order_id
            """)
            checks = [row[1] for row in cur.fetchall()]

            max_check = max(checks) if checks else 0
            min_check = min(checks) if checks else 0
            avg_check = sum(checks) / len(checks) if checks else 0

            # 4. Топ-10 самых продаваемых товаров
            cur.execute("""
                SELECT i.id, i.title, SUM(oi.quantity) as sold
                FROM order_item oi
                JOIN items i ON oi.item_id = i.id
                GROUP BY i.id, i.title
                ORDER BY sold DESC
                LIMIT 10
            """)
            top_products = [
                {"id": row[0], "title": row[1], "sold": int(row[2])}
                for row in cur.fetchall()
            ]

            # 5. Товары, которые не покупают
            cur.execute("""
                SELECT i.id, i.title
                FROM items i
                LEFT JOIN order_item oi ON i.id = oi.item_id
                WHERE oi.item_id IS NULL
            """)
            unsold_products = [{"id": row[0], "title": row[1]} for row in cur.fetchall()]

            # 6. Товары с маленьким остатком (<5)
            cur.execute("""
                SELECT id, title, stock
                FROM items
                WHERE stock < 5
                ORDER BY stock ASC
            """)
            low_stock = [{"id": row[0], "title": row[1], "stock": float(row[2])} for row in cur.fetchall()]

            # 7. Продажи по категориям
            cur.execute("""
                SELECT c.category_name, COALESCE(SUM(oi.quantity * oi.price_at_purchase),0) as revenue
                FROM order_item oi
                JOIN items i ON oi.item_id = i.id
                JOIN item_category ic ON i.id = ic.item_id
                JOIN category c ON ic.category_id = c.id
                GROUP BY c.category_name
                ORDER BY revenue DESC
            """)
            sales_by_category = [
                {"category": row[0], "revenue": float(row[1])}
                for row in cur.fetchall()
            ]

            # 8. Продажи по подкатегориям
            cur.execute("""
                SELECT sc.subcategory_name, COALESCE(SUM(oi.quantity * oi.price_at_purchase),0) as revenue
                FROM order_item oi
                JOIN items i ON oi.item_id = i.id
                JOIN item_subcategory isc ON i.id = isc.item_id
                JOIN subcategory sc ON isc.subcategory_id = sc.id
                GROUP BY sc.subcategory_name
                ORDER BY revenue DESC
            """)
            sales_by_subcategory = [
                {"subcategory": row[0], "revenue": float(row[1])}
                for row in cur.fetchall()
            ]

        return {
            "total_orders": total_orders,
            "total_items_sold": total_items_sold,
            "max_check": float(max_check),
            "min_check": float(min_check),
            "avg_check": float(avg_check),
            "top_10_products": top_products,
            "unsold_products": unsold_products,
            "low_stock": low_stock,
            "sales_by_category": sales_by_category,
            "sales_by_subcategory": sales_by_subcategory
        }
    except Exception as e:
        print(f"❌ Error in analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))