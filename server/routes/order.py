from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db.context import get_db_cursor
from core.auth import get_current_user_id

router = APIRouter(prefix="/orders", tags=["orders"])

class OrderItemIn(BaseModel):
    item_id: int
    quantity: int

class CheckoutSuccessRequest(BaseModel):
    items: list[OrderItemIn]

@router.post("/checkout-success")
def checkout_success(
    body: CheckoutSuccessRequest,
    db = Depends(get_db_cursor),  # <--- здесь ты уже получаешь курсор!
):
    # user_id — должен быть вызов функции, а не сама функция!
    user_id = get_current_user_id()

    if not body.items:
        raise HTTPException(400, "Order must have at least one item")

    try:
        # 1. Создать заказ
        db.execute(
            "INSERT INTO orders (user_id, status) VALUES (%s, %s) RETURNING id;",
            (user_id, "created")
        )
        order_id = db.fetchone()[0]

        # 2. Добавить товары в order_item и уменьшить остатки
        for item in body.items:
            # Получить цену товара на момент покупки
            db.execute(
                "SELECT price FROM items WHERE id = %s;",
                (item.item_id,)
            )
            row = db.fetchone()
            if not row:
                raise HTTPException(400, f"Product with id={item.item_id} not found")
            price_at_purchase = row[0]

            # Вставить в order_item
            db.execute(
                """
                INSERT INTO order_item (order_id, item_id, quantity, price_at_purchase)
                VALUES (%s, %s, %s, %s);
                """,
                (order_id, item.item_id, item.quantity, price_at_purchase)
            )
            # Уменьшить остаток товара
            db.execute(
                """
                UPDATE items SET quantity = quantity - %s
                WHERE id = %s AND quantity >= %s;
                """,
                (item.quantity, item.item_id, item.quantity)
            )
            if db.rowcount == 0:
                raise HTTPException(400, f"Not enough product id={item.item_id}")

        # Очистить корзину пользователя (если есть таблица cart_items)
        db.execute(
            "DELETE FROM cart_items WHERE user_id = %s;",
            (user_id,)
        )

        return {"order_id": order_id, "message": "Order successfully created"}

    except Exception as e:
        # Не надо делать rollback или close: контекст-менеджер сделает это сам
        raise HTTPException(400, f"Error when placing an order: {str(e)}")
