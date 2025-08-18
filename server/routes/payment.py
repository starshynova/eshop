# stripe_routes.py
import os
import stripe
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/payments", tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # тестовый ключ

class PaymentRequest(BaseModel):
    amount: float  # или int, если в центах
    currency: str = "eur"

@router.post("/create-payment")
async def create_payment_intent(payment: PaymentRequest):
    try:
        amount_cents = int(payment.amount * 100)
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment.currency,
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
