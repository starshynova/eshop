from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
from pathlib import Path

<<<<<<< Updated upstream
app = FastAPI()
# app.add_middleware(ProxyHeadersMiddleware)
=======

app = FastAPI(trust_env=True)

>>>>>>> Stashed changes

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://eshop-star.netlify.app"
]

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

secret_key_session_middleware=os.getenv("SECRET_KEY_SESSION_MIDDLEWARE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # вместо ["*"]
    allow_credentials=True,     # без куки и авторизации, если не нужно
    allow_methods=["*"],         # GET, POST, PUT и т. д.
    allow_headers=["*"],         # Content-Type и прочие
)

app.add_middleware(SessionMiddleware, secret_key=secret_key_session_middleware)

from routes.item import router as item_router
# from routes.init_qdrant import router as init_qdrant_router
# from routes.item_qdrant import router as item_qdrant_router
from routes.img_upload import router as img_upload_router
from routes.user import router as user_router
from routes.cart import router as cart_router
from routes.payment import router as payment_router
from routes.order import router as order_router
from routes.analytics import router as analytics_router

app.include_router(item_router)
# app.include_router(init_qdrant_router)
# app.include_router(item_qdrant_router)
app.include_router(img_upload_router)
app.include_router(user_router)
app.include_router(cart_router)
app.include_router(payment_router)
app.include_router(order_router)
app.include_router(analytics_router)

@app.middleware("http")
async def force_https_redirects(request: Request, call_next):
    response = await call_next(request)
    if "location" in response.headers:
        location = response.headers["location"]
        if location.startswith("http://"):
            response.headers["location"] = location.replace("http://", "https://", 1)
    return response


@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    return response


@app.get("/")
def read_root():
    print("✅ FastAPI server started")
    return {"message": "Server is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8080, proxy_headers=True)
