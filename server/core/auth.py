from fastapi import HTTPException, Depends, status
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt

from db.context import get_db_cursor
from fastapi.security import OAuth2PasswordBearer

import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

secret_key = os.getenv("SECRET_KEY")
algorithm_hs = os.getenv("ALGORITHM")
access_token_expire_minutes = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire_time = expires_delta if expires_delta is not None else timedelta(minutes=access_token_expire_minutes)
    expire = datetime.now(timezone.utc) + expire_time
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, secret_key, algorithm=algorithm_hs)
    return token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm_hs])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )