from fastapi import APIRouter, Depends, HTTPException
from db.context import get_db_cursor
from core.auth import get_current_user_id
import uuid

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/checkout-success")
def checkout_success(user_id: str = Depends(get_current_user_id)):
    print("user id for orders:", user_id)
    try:
        with get_db_cursor() as cur:
            # 1. Получить корзину пользователя из базы
            cur.execute(
                "SELECT item_id, quantity FROM cart_item WHERE user_id = %s;",
                (user_id,)
            )
            cart = cur.fetchall()
            if not cart:
                raise HTTPException(400, "Ваша корзина пуста!")

            # 2. Создать заказ
            order_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO orders (id, user_id, status) VALUES (%s, %s, %s) RETURNING id;",
                (order_id, user_id, "paid")
            )

            for item_id, quantity in cart:
                # Получить цену на момент покупки
                cur.execute(
                    "SELECT price FROM items WHERE id = %s;",
                    (item_id,)
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(400, f"Товар id={item_id} не найден")
                price_at_purchase = row[0]

                # Добавить товар в заказ
                cur.execute(
                    """
                    INSERT INTO order_item (order_id, item_id, quantity, price_at_purchase)
                    VALUES (%s, %s, %s, %s);
                    """,
                    (order_id, item_id, quantity, price_at_purchase)
                )
                # Уменьшить остаток товара
                cur.execute(
                    """
                    UPDATE items SET quantity = quantity - %s
                    WHERE id = %s AND quantity >= %s;
                    """,
                    (quantity, item_id, quantity)
                )
                if cur.rowcount == 0:
                    raise HTTPException(400, f"Недостаточно товара id={item_id}")

            # 3. Очистить корзину пользователя
            cur.execute(
                "DELETE FROM cart_item WHERE user_id = %s;",
                (user_id,)
            )
            print("Order created, returning to client", order_id)
            return {"order_id": order_id, "message": "Заказ успешно создан"}

    except HTTPException as e:
        # HTTPException не заворачиваем заново, просто пробрасываем
        raise
    except Exception as e:
        # Все остальные ошибки заворачиваем в HTTPException
        raise HTTPException(400, f"Ошибка при оформлении заказа: {str(e)}")