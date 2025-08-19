import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
from db.context import get_db_cursor
from core.auth import get_current_user_id
import uuid


env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/payments", tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # тестовый ключ

class PaymentRequest(BaseModel):
    amount: float  # или int, если в центах
    currency: str = "eur"

@router.post("/create-payment")
async def create_payment_intent(payment: PaymentRequest, user_id: str = Depends(get_current_user_id)):
    try:
        amount_cents = int(payment.amount * 100)
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment.currency,
            automatic_payment_methods={"enabled": True},
            metadata={"user_id": user_id}
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    print("🔥 Webhook endpoint triggered")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    print("📩 Webhook received")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        print(f"✅ Event type: {event['type']}")
    except stripe.error.SignatureVerificationError:
        print("❌ Invalid signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        user_id = intent["metadata"].get("user_id")
        payment_intent_id = intent["id"]
        amount = intent["amount"] / 100

        print(f"💰 Payment succeeded for user_id={user_id}, amount={amount}, intent_id={payment_intent_id}")

        try:
            with get_db_cursor() as cur:
                cur.execute("SELECT id FROM orders WHERE payment_intent_id = %s;", (payment_intent_id,))
                if cur.fetchone():
                    print("⚠️ Order already processed for this payment_intent_id")
                    return {"status": "already processed"}

                cur.execute("SELECT item_id, quantity FROM cart_item WHERE user_id = %s;", (user_id,))
                cart = cur.fetchall()
                print(f"🛒 Cart contents: {cart}")
                if not cart:
                    print("❌ Cart is empty")
                    raise HTTPException(400, "Корзина пуста")

                order_id = str(uuid.uuid4())
                cur.execute(
                    "INSERT INTO orders (id, user_id, status, payment_intent_id) VALUES (%s, %s, %s, %s);",
                    (order_id, user_id, "paid", payment_intent_id)
                )
                print(f"📦 Created order: {order_id}")

                for item_id, quantity in cart:
                    cur.execute("SELECT price FROM items WHERE id = %s;", (item_id,))
                    row = cur.fetchone()
                    if not row:
                        print(f"❌ Item not found: id={item_id}")
                        raise HTTPException(400, f"Товар id={item_id} не найден")
                    price_at_purchase = row[0]

                    cur.execute(
                        """INSERT INTO order_item (order_id, item_id, quantity, price_at_purchase)
                           VALUES (%s, %s, %s, %s);""",
                        (order_id, item_id, quantity, price_at_purchase)
                    )

                    cur.execute(
                        "UPDATE items SET quantity = quantity - %s WHERE id = %s AND quantity >= %s;",
                        (quantity, item_id, quantity)
                    )
                    if cur.rowcount == 0:
                        print(f"❌ Not enough stock for item_id={item_id}")
                        raise HTTPException(400, f"Недостаточно товара id={item_id}")

                cur.execute("DELETE FROM cart_item WHERE user_id = %s;", (user_id,))
                print(f"✅ Cart cleared for user_id={user_id}")
                print(f"🎉 Order finalized via webhook: {order_id}")
        except Exception as e:
            print(f"🔥 Error during order creation: {str(e)}")
            raise HTTPException(400, f"Ошибка при оформлении заказа: {str(e)}")

    return {"status": "success"}
