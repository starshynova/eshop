from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, constr
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt as jose_jwt

from db.context import get_db_cursor
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from starlette.responses import RedirectResponse

import os
from dotenv import load_dotenv
from pathlib import Path
from core.auth import create_access_token_for_user


router = APIRouter(prefix="/users", tags=["users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# env_path = Path(__file__).resolve().parent.parent.parent / '.env'
# load_dotenv(dotenv_path=env_path)

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v3/',
    client_kwargs={'scope': 'email profile'}
)


class UserCreate(BaseModel):
    role: str
    email: EmailStr
    password: str
    first_name: constr(min_length=2, max_length=30)
    last_name: constr(min_length=2, max_length=30)
    address_line1: str
    address_line2: str | None = None
    post_code: constr(min_length=6, max_length=6)
    city: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register", status_code=201)
def register_user(user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    user_id = str(uuid.uuid4())
    created_date = datetime.now(timezone.utc)
    access_token = None

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT id FROM users WHERE email = %s", (user.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="A user with this email address already exists.")

            insert_query = """
                INSERT INTO users (
                    id, role, email, password, first_name, last_name,
                    address_line1, address_line2, post_code, city, created_date
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(insert_query, (
                user_id,
                user.role,
                user.email,
                hashed_password,
                user.first_name,
                user.last_name,
                user.address_line1,
                user.address_line2,
                user.post_code,
                user.city,
                created_date
            ))

            access_token = create_access_token_for_user(user_id=user_id, role=user.role)

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to register user")

    return {
        "message": "User successfully registered",
        "user_id": user_id,
        "token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", status_code=200)
def login_user(credentials: UserLogin):
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT id, password, role FROM users WHERE email = %s", (credentials.email,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=400, detail="Invalid email or password")

            user_id, stored_hash, role = result
            if not pwd_context.verify(credentials.password, stored_hash):
                raise HTTPException(status_code=400, detail="Invalid email or password")

            access_token = create_access_token_for_user(user_id=str(user_id), role=role)

            return {"token": access_token, "token_type": "bearer"}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error when trying to log in")


@router.get("/oauth/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for('google_auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/oauth/google/callback", name="google_auth_callback")
async def google_auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)

        resp = await oauth.google.get("userinfo", token=token)
        user_info = resp.json()
        user_email = user_info.get("email")
        first_name = user_info.get("given_name")
        last_name = user_info.get("family_name")

        if not user_email:
            raise HTTPException(status_code=400, detail="Email from Google profile could not be retrieved")

        with get_db_cursor() as cur:

            cur.execute("SELECT id, role FROM users WHERE email = %s", (user_email,))
            row = cur.fetchone()

            if row:
                user_id, role = row
            else:
                user_id = str(uuid.uuid4())
                role = "user"
                created_date = datetime.now(timezone.utc)
                cur.execute("""
                    INSERT INTO users (
                        id, role, email, password, first_name, last_name,
                        address_line1, address_line2, post_code, city, created_date
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    user_id, "user", user_email, "", first_name or "GoogleUser", last_name or "",
                    None,  # address_line1
                    None,  # address_line2
                    None,  # post_code
                    None,  # city
                    created_date
                ))

            access_token = create_access_token_for_user(user_id=user_id, role=role)

    except Exception as e:
        import traceback
        print("OAuth ERROR:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="OAuth login failed")

    return RedirectResponse(f"http://localhost:5173/welcome?token={access_token}")

