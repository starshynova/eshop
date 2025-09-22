from fastapi import APIRouter, Depends, HTTPException, status , Path
from pydantic import BaseModel, conint
from db.context import get_db_cursor
from core.auth import get_current_user_id
from typing import List

router = APIRouter(prefix="/carts", tags=["carts"])

class AddToCartRequest(BaseModel):
    item_id: str
    stock: conint(gt=0)

class CartItemOut(BaseModel):
    id: str          # item_id
    title: str
    price: float
    stock: int
    main_photo_url: str | None = None

class EditCartItemRequest(BaseModel):
    stock: conint(gt=0)

@router.post("/add")
def add_to_cart(
    req: AddToCartRequest,
    user_id: str = Depends(get_current_user_id)
):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                    INSERT INTO cart_item (user_id, item_id, stock)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (user_id, item_id)
                    DO UPDATE SET stock = cart_item.stock + EXCLUDED.stock;
                """, (user_id, req.item_id, req.stock))
        return {"status": "ok"}
    except Exception as e:
        print("Add to cart error:", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/count")
def get_cart_count(user_id: str = Depends(get_current_user_id)):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT COALESCE(SUM(stock), 0)
            FROM cart_item
            WHERE user_id = %s
        """, (user_id,))
        (count,) = cur.fetchone()
    return {"count": int(count)}


@router.get("/items", response_model=dict)
def get_cart_items(user_id: str = Depends(get_current_user_id)):
    """
    Возвращает список товаров в корзине текущего пользователя.
    Формат: {"items": [ {id, title, price, stock, main_photo_url}, ... ]}
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
                    ci.stock              AS stock,
                    i.main_photo_url         AS main_photo_url         -- или i.image
                FROM cart_item ci
                JOIN items i ON i.id = ci.item_id
                WHERE ci.user_id = %s
                ORDER BY i.title ASC;
            """, (user_id,))

            rows = cur.fetchall()

        items: List[CartItemOut] = []
        for r in rows:
            # r = (id, title, price, stock, main_photo_url)
            items.append(CartItemOut(
                id=str(r[0]),
                title=r[1],
                price=float(r[2]),
                stock=int(r[3]),
                main_photo_url=r[4]
            ))

        return {"items": items}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to fetch cart items")


@router.delete("/items/{item_id}")
def remove_cart_item(
    item_id: str = Path(...),
    user_id: str = Depends(get_current_user_id)
):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                DELETE FROM cart_item
                WHERE user_id = %s AND item_id = %s
            """, (user_id, item_id))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/items/{item_id}")
def edit_cart_item(
    item_id: str = Path(...),
    req: EditCartItemRequest = ...,
    user_id: str = Depends(get_current_user_id)
):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                UPDATE cart_item
                SET stock = %s
                WHERE user_id = %s AND item_id = %s
            """, (req.stock, user_id, item_id))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

