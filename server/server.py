from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
from pathlib import Path

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

secret_key_session_middleware=os.getenv("SECRET_KEY_SESSION_MIDDLEWARE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # вместо ["*"]
    allow_credentials=False,     # без куки и авторизации, если не нужно
    allow_methods=["*"],         # GET, POST, PUT и т. д.
    allow_headers=["*"],         # Content-Type и прочие
)

app.add_middleware(SessionMiddleware, secret_key=secret_key_session_middleware)

from routes.item import router as item_router
from routes.init_qdrant import router as init_qdrant_router
from routes.item_qdrant import router as item_qdrant_router
from routes.img_upload import router as img_upload_router
from routes.user import router as user_router
from routes.cart import router as cart_router

app.include_router(item_router)
app.include_router(init_qdrant_router)
app.include_router(item_qdrant_router)
app.include_router(img_upload_router)
app.include_router(user_router)
app.include_router(cart_router)


@app.get("/")
def read_root():
    return {"message": "Server is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8080, reload=True)
