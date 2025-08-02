# import os
# import psycopg2
# from dotenv import load_dotenv
# from pathlib import Path
#
# # Загружаем переменные окружения из .env
# env_path = Path(__file__).resolve().parent.parent.parent / '.env'
# load_dotenv(dotenv_path=env_path)
#
# def get_connection():
#     print("Подключение к базе данных...")
#     return psycopg2.connect(
#         dbname=os.getenv("POSTGRES_DB"),
#         user=os.getenv("POSTGRES_USER"),
#         password=os.getenv("POSTGRES_PASSWORD"),
#         host=os.getenv("DB_HOST", "localhost"),
#         port=os.getenv("DB_PORT", "5432"),
#         sslmode="require"
#     )
#
# print("✅ Connect to DB successfully!")

import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

def get_connection():
    print("Подключение к NeonDB...")
    print("DB_HOST =", os.getenv("DB_HOST"))
    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT", "5432"),
        sslmode="require"
    )

if __name__ == "__neondb__":
    conn = get_connection()
    print("✅ Подключение к NeonDB установлено!")
    conn.close()
