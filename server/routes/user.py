from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, constr
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext

from db.connectDB import get_connection

# Инициализация роутера для пользовательских маршрутов
router = APIRouter()

# Настройка контекста для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: constr(min_length=2, max_length=30)
    last_name: constr(min_length=2, max_length=30)
    address_line1: str
    address_line2: str | None = None
    post_code: constr(min_length=6, max_length=6)
    city: str


@router.post("/register", status_code=201)
def register_user(user: UserCreate):
    """Регистрация нового пользователя с проверкой и хешированием пароля"""
    # Хешируем пароль
    hashed_password = pwd_context.hash(user.password)

    # Генерируем UUID и текущую дату/время в UTC (timezone-aware)
    user_id = str(uuid.uuid4())
    created_date = datetime.now(timezone.utc)

    try:
        conn = get_connection()
        cur = conn.cursor()
        # Проверяем, существует ли пользователь с таким email
        cur.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

        # Вставляем нового пользователя
        insert_query = """
            INSERT INTO users (
                id, email, password, first_name, last_name,
                address_line1, address_line2, post_code, city, created_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(insert_query, (
            user_id,
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
        conn.commit()
    except HTTPException:
        raise
    except Exception:
        # Логирование ошибки можно добавить здесь
        raise HTTPException(status_code=500, detail="Не удалось зарегистрировать пользователя")
    finally:
        cur.close()
        conn.close()

    return {"message": "Пользователь успешно зарегистрирован", "user_id": user_id}
