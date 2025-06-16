from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.item import router as item_router



app = FastAPI()
app.include_router(item_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В проде — заменить на конкретный адрес, например: ["https://your-frontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    print("Запрос к / получен!")
    return {"message": "Server is running!"}
