from fastapi import APIRouter, Depends, HTTPException
from db.context import get_db_cursor
from core.auth import get_current_user_id
import uuid
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/orders", tags=["orders"])

class OrderProduct(BaseModel):
    id: str
    title: str
    main_photo_url: Optional[str]
    price: float
    quantity: int

class OrderResponse(BaseModel):
    id: str
    created_at: str
    status: str
    items: List[OrderProduct]
    total_price: float

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


@router.get("/my", response_model=List[OrderResponse])
def get_my_orders(
    user_id: str = Depends(get_current_user_id)
):
    with get_db_cursor() as cur:
        cur.execute("""
                SELECT id, created_at, status
                FROM orders
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))
        orders = cur.fetchall()
        results = []

        for order in orders:
            order_id, created_at, status = order
            cur.execute("""
                    SELECT
                        oi.item_id AS id,
                        i.title,
                        i.main_photo_url,
                        oi.price_at_purchase AS price,
                        oi.quantity
                    FROM order_item oi
                    JOIN items i ON oi.item_id = i.id
                    WHERE oi.order_id = %s
                """, (order_id,))
            items = cur.fetchall()
            item_list = []
            total_price = 0

            for item in items:
                item_id, title, main_photo_url, price, quantity = item
                total_price += float(price) * quantity
                item_list.append(OrderProduct(
                    id=str(item_id),
                    title=title,
                    main_photo_url=main_photo_url,
                    price=float(price),
                    quantity=quantity
                ))
            results.append(OrderResponse(
                id=str(order_id),
                created_at=str(created_at),
                status=status,
                items=item_list,
                total_price=total_price
            ))
        return results
