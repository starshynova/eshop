# from fastapi import APIRouter, Depends, HTTPException, status
# from pydantic import BaseModel, conint
# from ..db.context import get_db_cursor
#
# router = APIRouter(prefix="/carts", tags=["carts"])
#
# # Количество только положительное
# class AddToCartRequest(BaseModel):
#     item_id: str
#     quantity: conint(gt=0)  # только положительные значения
#
# # Подразумеваемая функция получения user_id из сессии или токена
# def get_current_user_id():
#     # Здесь твоя логика извлечения id пользователя из токена/сессии
#     return "some-user-id"

# @router.post("/add")
# def add_to_cart(
#     req: AddToCartRequest,
#     user_id: str = Depends(get_current_user_id)
# ):
#     try:
#         with get_db_cursor() as cur:
#             cur.execute("""
#                 INSERT INTO cart_items (user_id, item_id, quantity)
#                 VALUES (%s, %s, %s)
#                 ON CONFLICT (user_id, item_id)
#                 DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
#             """, (user_id, req.item_id, req.quantity))
#         return {"status": "ok"}
#     except Exception as e:
#         # Можешь добавить логирование или вернуть подробности для дебага
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
