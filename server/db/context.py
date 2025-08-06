from contextlib import contextmanager
from .connectDB import get_connection

@contextmanager
def get_db_cursor():
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        yield cur
        conn.commit()  # если нужно
    except Exception:
        if conn:
            conn.rollback()
        raise
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
