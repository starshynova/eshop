from fastapi import APIRouter, HTTPException, status, Depends, Body
from pydantic import BaseModel, EmailStr, constr
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext

from db.context import get_db_cursor
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from starlette.responses import RedirectResponse

import os
from core.auth import create_access_token_for_user
from core.auth import get_current_user


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

def verify_google_id_token(id_token: str, expected_email: str) -> bool:
    # TODO: Реальная валидация через JWKS/Google tokeninfo (см. подсказку выше)
    return False

def _is_local_account(stored_hash) -> bool:
    return bool(stored_hash)   # если есть непустой пароль — локальный аккаунт

def _validate_new_password(pwd: str):
    if not isinstance(pwd, str) or len(pwd) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters.")

allowedFields = {
    "email",
    "first_name",
    "last_name",
    "address_line1",
    "address_line2",
    "post_code",
    "city",
    "role"
}

def _validate_profile_payload(data: dict) -> dict:
    if not isinstance(data, dict):
        raise HTTPException(status_code=422, detail="Body must be a JSON object.")
    unknown = set(data.keys()) - allowedFields
    if unknown:
        raise HTTPException(status_code=422, detail=f"Unknown fields: {', '.join(sorted(unknown))}")

    updates = {}

    if "email" in data:
        email = (data.get("email") or "").strip()
        if "@" not in email or "." not in email.split("@")[-1]:
            raise HTTPException(status_code=422, detail="Invalid email.")
        updates["email"] = email

    if "role" in data:
        role = str(data.get("role") or "").strip().lower()
        if role not in {"user", "admin"}:
            raise HTTPException(status_code=422, detail="Role must be 'user' or 'admin'.")
        updates["role"] = role

    for key in ["first_name", "last_name", "address_line1", "address_line2", "post_code", "city"]:
        if key in data:
            val = data.get(key)
            if val is not None and not isinstance(val, str):
                raise HTTPException(status_code=422, detail=f"Field '{key}' must be a string or null.")
            updates[key] = (val.strip() if isinstance(val, str) else val)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    return updates

# def _validate_new_password(pwd: str):
#     if not isinstance(pwd, str) or len(pwd) < 8:
#         raise HTTPException(status_code=422, detail="Password must be at least 8 characters.")
#     # сюда можно добавить требования: цифра/буква/символ и т.п.



def serialize_user(row) -> dict:
    return {
        "id": str(row[0]),
        "role": row[1] or "",
        "email": row[2] or "",
        "first_name": row[3] or "",
        "last_name": row[4] or "",
        "address_line1": row[5] or "",
        "address_line2": row[6] or "",
        "post_code": row[7] or "",
        "city": row[8] or "",
        "is_google_account": (row[9] == "" or row[9] is None),
    }



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
    # redirect_uri = "http://localhost:8000/users/oauth/google/callback"
    redirect_uri = "https://server-little-butterfly-314.fly.dev/users/oauth/google/callback"
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


@router.get("/all-users")
def list_users():
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT id, role, email, first_name, last_name, address_line1, address_line2, post_code, city, created_date
                FROM users;
            """)
            rows = cur.fetchall()
        return [serialize_user(r) for r in rows]
    except Exception as e:
        print("Error in list_users:", e)  # Для отладки!
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get users"
        )


@router.get("/{user_id}")
def get_user_by_id(user_id: str):

    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT id, role, email, first_name, last_name, address_line1, address_line2, post_code, city, password
                FROM users
                WHERE id = %s;
            """, (str(user_id),))
            row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"User {user_id} not found")
        return serialize_user(row)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to get user")


@router.patch("/me")
def update_me(data = Body(...), current_user = Depends(get_current_user)):
    return update_user_profile(current_user["user_id"], data, current_user)


@router.patch("/{user_id}")
def update_user_profile(user_id: str, data = Body(...), current_user = Depends(get_current_user)):
    print("IN update_user_profile: user_id from URL =", user_id, "current_user['user_id'] =", current_user.get("user_id"))
    is_admin = current_user.get("role") == "admin"
    is_self = current_user.get("user_id") == user_id
    if not (is_admin or is_self):
        raise HTTPException(status_code=403, detail="You are not allowed to edit this user.")

    updates = _validate_profile_payload(data)

    # смена роли — только админ
    role_updated = False
    if "role" in updates:
        if not is_admin:
            raise HTTPException(status_code=403, detail="Only admins can change user roles.")
        role_updated = True

    # проверка уникальности email
    if "email" in updates:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1 FROM users WHERE email = %s AND id <> %s", (updates["email"], user_id))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="This email is already taken by another user.")

    try:
        set_parts = []
        values = []
        for col, val in updates.items():
            set_parts.append(f"{col} = %s")
            values.append(val)
        set_clause = ", ".join(set_parts)
        with get_db_cursor() as cur:
            cur.execute(f"UPDATE users SET {set_clause} WHERE id = %s", (*values, user_id))

        new_token = None
        if role_updated:
            new_token = create_access_token_for_user(user_id=user_id, role=updates["role"])
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to update user")

    resp = {"message": "User successfully updated"}
    if role_updated and new_token:
        resp.update({"token": new_token, "token_type": "bearer"})
    return resp


# ====================== 2. Смена пароля ======================

@router.patch("/me/password")
def change_my_password(data = Body(...), current_user = Depends(get_current_user)):
    if not isinstance(data, dict):
        raise HTTPException(status_code=422, detail="Body must be a JSON object.")

    new_password = (data.get("new_password") or "")
    _validate_new_password(new_password)

    user_id = current_user["user_id"]

    with get_db_cursor() as cur:
        cur.execute("SELECT email, password FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found.")
        email, stored_hash = row[0], row[1]

    if _is_local_account(stored_hash):
        current_password = data.get("current_password") or ""
        if not current_password:
            raise HTTPException(status_code=422, detail="'current_password' is required for local accounts.")
        if not pwd_context.verify(current_password, stored_hash):
            raise HTTPException(status_code=400, detail="Current password is incorrect.")
        if pwd_context.verify(new_password, stored_hash):
            raise HTTPException(status_code=400, detail="New password must be different from the current one.")
    else:
        google_id_token = data.get("google_id_token") or ""
        if not google_id_token or not verify_google_id_token(google_id_token, expected_email=email):
            raise HTTPException(status_code=401, detail="Reauthentication required: provide a valid 'google_id_token'.")

    try:
        new_hash = pwd_context.hash(new_password)
        with get_db_cursor() as cur:
            cur.execute("UPDATE users SET password = %s WHERE id = %s", (new_hash, user_id))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to change password")

    return {"message": "Password changed successfully"}

# @router.post("/oauth/google/token")
# async def exchange_code_for_token(request: Request):
#     try:
#         body = await request.json()
#         code = body.get("code")
#         if not code:
#             raise HTTPException(status_code=400, detail="Missing authorization code.")
#
#         token = await oauth.google.fetch_token(
#             grant_type="authorization_code",
#             code=code,
#             redirect_uri="postmessage",  # для popup flow
#         )
#
#         id_token = token.get("id_token")
#         if not id_token:
#             raise HTTPException(status_code=400, detail="No ID token received from Google.")
#
#         return {"google_id_token": id_token}
#
#     except Exception as e:
#         import traceback
#         print("OAuth token exchange error:", e)
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Failed to exchange code for token.")

@router.post("/me/set-password")
def set_password_for_google_user(
    data = Body(...),
    current_user = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    new_password = (data.get("new_password") or "").strip()
    confirm_password = (data.get("confirm_password") or "").strip()

    if not new_password or not confirm_password:
        raise HTTPException(status_code=422, detail="Password fields required.")
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    if len(new_password) < 8:
        raise HTTPException(status_code=422, detail="Password too short.")

    with get_db_cursor() as cur:
        cur.execute("SELECT password FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found.")
        current_hash = row[0]

    # Разрешаем только если пароля ещё не было
    if current_hash:
        raise HTTPException(status_code=400, detail="Password already set for this user.")

    # Сохраняем новый пароль (bcrypt hash)
    hash_new = pwd_context.hash(new_password)
    try:
        with get_db_cursor() as cur:
            cur.execute("UPDATE users SET password = %s WHERE id = %s", (hash_new, user_id))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to set password.")

    return {"message": "Password set successfully."}


@router.patch("/{user_id}/password")
def admin_reset_password(user_id: str, data = Body(...), current_user = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can change other users' passwords.")

    if not isinstance(data, dict):
        raise HTTPException(status_code=422, detail="Body must be a JSON object.")

    new_password = (data.get("new_password") or "")
    _validate_new_password(new_password)

    with get_db_cursor() as cur:
        cur.execute("SELECT 1 FROM users WHERE id = %s", (user_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="User not found.")

    try:
        new_hash = pwd_context.hash(new_password)
        with get_db_cursor() as cur:
            cur.execute("UPDATE users SET password = %s WHERE id = %s", (new_hash, user_id))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to change password")

    return {"message": "Password reset successfully"}


@router.delete("/me")
def delete_my_account(current_user = Depends(get_current_user)):
    user_id = current_user["user_id"]

    with get_db_cursor() as cur:
        cur.execute("SELECT email FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found.")

    try:
        with get_db_cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete account")

    return {"message": "Account deleted"}


@router.delete("/{user_id}")
def admin_delete_user(user_id: str, current_user = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users.")

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1 FROM users WHERE id = %s", (user_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="User not found.")
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete user")

    return {"message": "User deleted"}