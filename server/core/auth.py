# auth.py
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
    sub: str          # user id
    role: str         # user role
    exp: int          # set by lib on encode from datetime

def create_access_token_for_user(user_id: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    expire_time = expires_delta or timedelta(minutes=access_token_expire_minutes)
    payload: UserClaims = {
        "sub": user_id,
        "role": role,
        "exp": int((datetime.now(timezone.utc) + expire_time).timestamp()),
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm_hs)

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserClaims:
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm_hs])
        user_id = payload.get("sub")
        role = payload.get("role")
        if not user_id or not role:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        return {"sub": str(user_id), "role": str(role), "exp": payload.get("exp", 0)}  # type: ignore
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    claims = get_current_user(token)
    return claims["sub"]
