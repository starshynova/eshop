from fastapi import APIRouter, Depends, HTTPException, status , Path
from pydantic import BaseModel, conint
from db.context import get_db_cursor
from core.auth import get_current_user_id
from typing import List

router = APIRouter(prefix="/carts", tags=["carts"])

class AddToCartRequest(BaseModel):
    item_id: str
    quantity: conint(gt=0)

class CartItemOut(BaseModel):
    id: str
    title: str
    price: float
    quantity: int
    stock: int
    main_photo_url: str | None = None

class EditCartItemRequest(BaseModel):
    quantity: conint(gt=0)

# @router.post("/add")
# def add_to_cart(
#     req: AddToCartRequest,
#     user_id: str = Depends(get_current_user_id)
# ):
#     try:
#         with get_db_cursor() as cur:
#             cur.execute("""
#                     INSERT INTO cart_item (user_id, item_id, quantity)
#                     VALUES (%s, %s, %s)
#                     ON CONFLICT (user_id, item_id)
#                     DO UPDATE SET quantity = cart_item.quantity + EXCLUDED.quantity;
#                 """, (user_id, req.item_id, req.quantity))
#         return {"status": "ok"}
#     except Exception as e:
#         print("Add to cart error:", e)
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/add")
def add_to_cart(
    req: AddToCartRequest,
    user_id: str = Depends(get_current_user_id)
):
    try:
        with get_db_cursor() as cur:
            # Получаем текущий остаток на складе
            cur.execute("SELECT stock FROM items WHERE id = %s", (req.item_id,))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Item not found")
            stock = row[0]

            # Узнаём, сколько уже есть в корзине у пользователя
            cur.execute("""
                SELECT quantity FROM cart_item WHERE user_id = %s AND item_id = %s
            """, (user_id, req.item_id))
            cart_row = cur.fetchone()
            current_quantity = cart_row[0] if cart_row else 0

            new_total_quantity = current_quantity + req.quantity
            if new_total_quantity > stock:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock. Available: {stock}, you want to add: {new_total_quantity}"
                )

            # Теперь можно добавлять/обновлять
            cur.execute("""
                INSERT INTO cart_item (user_id, item_id, quantity)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, item_id)
                DO UPDATE SET quantity = EXCLUDED.quantity;
            """, (user_id, req.item_id, new_total_quantity))
        return {"status": "ok"}
    except HTTPException:
        raise  # чтобы не ловить и не терять detail
    except Exception as e:
        print("Add to cart error:", e)
        raise HTTPException(status_code=400, detail=str(e))


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
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT
                    ci.item_id AS id,
                    i.title AS title,        
                    i.price AS price,
                    ci.quantity AS quantity,           
                    i.stock AS stock,
                    i.main_photo_url AS main_photo_url         
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
                quantity=int(r[3]),
                stock=int(r[4]),
                main_photo_url=r[5]
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
                SET quantity = %s
                WHERE user_id = %s AND item_id = %s
            """, (req.quantity, user_id, item_id))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

