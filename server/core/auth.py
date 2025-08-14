from fastapi import HTTPException, Depends, status
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import TypedDict, Optional

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

secret_key = os.getenv("SECRET_KEY") or "change-me"
algorithm_hs = os.getenv("ALGORITHM") or "HS256"
access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class UserClaims(TypedDict):
    user_id: str          # user id
    role: str         # user role
    exp: int          # set by lib on encode from datetime

def create_access_token_for_user(user_id: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    expire_time = expires_delta or timedelta(minutes=access_token_expire_minutes)
    payload: UserClaims = {
        "user_id": user_id,
        "role": role,
        "exp": int((datetime.now(timezone.utc) + expire_time).timestamp()),
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm_hs)

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserClaims:
    print("get_current_user called with token:", token)

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm_hs])
        user_id = payload.get("user_id")
        role = payload.get("role")
        print("user id from payload", user_id)
        if not user_id or not role:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        return {"user_id": str(user_id), "role": str(role), "exp": payload.get("exp", 0)}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    claims = get_current_user(token)
    return claims["user_id"]
