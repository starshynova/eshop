from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.item import router as item_router
from routes.init_qdrant import router as init_qdrant_router
from routes.item_qdrant import router as item_qdrant_router
from routes.img_upload import router as img_upload_router



app = FastAPI()
app.include_router(item_router)
app.include_router(init_qdrant_router)
app.include_router(item_qdrant_router)
app.include_router(img_upload_router)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8080, reload=True)