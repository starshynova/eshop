from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, conint
from db.context import get_db_cursor
from core.auth import get_current_user_id
from typing import List

router = APIRouter(prefix="/carts", tags=["carts"])

class AddToCartRequest(BaseModel):
    item_id: str
    quantity: conint(gt=0)

class CartItemOut(BaseModel):
    id: str          # item_id
    title: str
    price: float
    quantity: int
    image: str | None = None

@router.post("/add")
def add_to_cart(
    req: AddToCartRequest,
    user_id: str = Depends(get_current_user_id)
):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                    INSERT INTO cart_item (user_id, item_id, quantity)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (user_id, item_id)
                    DO UPDATE SET quantity = cart_item.quantity + EXCLUDED.quantity;
                """, (user_id, req.item_id, req.quantity))
        return {"status": "ok"}
    except Exception as e:
        print("Add to cart error:", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/count")
def get_cart_count(user_id: str = Depends(get_current_user_id)):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT COALESCE(SUM(quantity), 0)
            FROM cart_item
            WHERE user_id = %s
        """, (user_id,))
        (count,) = cur.fetchone()
    return {"count": int(count)}


@router.get("/items", response_model=dict)
def get_cart_items(user_id: str = Depends(get_current_user_id)):
    """
    Возвращает список товаров в корзине текущего пользователя.
    Формат: {"items": [ {id, title, price, quantity, image}, ... ]}
    """
    try:
        with get_db_cursor() as cur:
            # Подстрой названия столбцов items.* под свою схему:
            # title -> name/title, image_url -> image/thumbnail и т.д.
            cur.execute("""
                SELECT
                    ci.item_id               AS id,
                    i.title                  AS title,        -- или i.name
                    i.price                  AS price,
                    ci.quantity              AS quantity,
                    i.main_photo_url         AS image         -- или i.image
                FROM cart_item ci
                JOIN items i ON i.id = ci.item_id
                WHERE ci.user_id = %s
                ORDER BY i.title ASC;
            """, (user_id,))

            rows = cur.fetchall()

        items: List[CartItemOut] = []
        for r in rows:
            # r = (id, title, price, quantity, image)
            items.append(CartItemOut(
                id=str(r[0]),
                title=r[1],
                price=float(r[2]),
                quantity=int(r[3]),
                image=r[4]
            ))

        return {"items": items}

    except Exception as e:
        # на проде логируй e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to fetch cart items")