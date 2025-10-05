from fastapi import APIRouter, HTTPException, status, Query
from db.context import get_db_cursor

router = APIRouter()

@router.get("/check-email/")
def check_email_exists(email: str = Query(..., description="Email to check")):
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT id FROM users WHERE email = %s;
            """, (email,))
            row = cur.fetchone()

        return {"exists": bool(row)}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check email: {e}"
        )