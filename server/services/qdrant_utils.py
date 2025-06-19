import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, NamedVectorStruct
from sentence_transformers import SentenceTransformer
from services.image_utils import get_image_vector_from_url

# Инициализация клиента
client = QdrantClient(host="localhost", port=6333)

# Текстовая модель (SentenceTransformer)
text_model = SentenceTransformer("all-MiniLM-L6-v2")

# Названия коллекций
TEXT_COLLECTION = "products"
IMAGE_COLLECTION = "products_image"

# 🔧 Создание коллекции для текстовых векторов
def init_qdrant_collection():
    client.recreate_collection(
        collection_name=TEXT_COLLECTION,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

# 🔧 Создание коллекции для image-векторов с именованным вектором
def init_image_collection():
    client.recreate_collection(
        collection_name=IMAGE_COLLECTION,
        vectors_config={
            "image": VectorParams(size=2048, distance=Distance.COSINE)
        },
    )

# 🧹 Очистка payload перед загрузкой в Qdrant
def clean_payload(product: dict) -> dict:
    return {
        k: str(v) if isinstance(v, uuid.UUID) else v
        for k, v in product.items()
        if v is not None and isinstance(v, (str, int, float, bool))
    }

# ➕ Добавление текстовых векторов
def add_products_to_qdrant(products: list):
    texts = [p["title"] + " " + (p["description"] or "") for p in products]
    vectors = text_model.encode(texts).tolist()
    points = [
        PointStruct(id=str(p["id"]), vector=vector, payload=clean_payload(p))
        for p, vector in zip(products, vectors)
    ]
    client.upsert(collection_name=TEXT_COLLECTION, points=points)

# 🔎 Поиск по тексту
def search_similar_products(query: str, top_k: int = 5):
    vector = text_model.encode(query).tolist()
    results = client.search(collection_name=TEXT_COLLECTION, query_vector=vector, limit=top_k)
    return [{"score": r.score, **r.payload} for r in results]

# ➕ Добавление image-векторов
def add_products_with_image_vectors(products: list):
    points = []
    for product in products:
        vector = get_image_vector_from_url(product["main_photo_url"])
        if vector:
            print("✔️ Вектор:", len(vector))
            point = PointStruct(
                id=str(product["id"]),
                vector={"image": vector},  # ✅ просто словарь
                payload=clean_payload(product),
            )
            points.append(point)

    print("📦 Загружаем", len(points), "векторов в Qdrant...")
    client.upsert(collection_name=IMAGE_COLLECTION, points=points)

def search_similar_images(image_url: str, top_k: int = 5):
    from services.image_utils import get_image_vector_from_url

    vector = get_image_vector_from_url(image_url)
    if vector is None:
        raise ValueError("Не удалось извлечь вектор из изображения.")

    results = client.search(
        collection_name=IMAGE_COLLECTION,
        query_vector={"name": "image", "vector": vector},  # 🛠️ фикс
        limit=top_k,
    )
    return [{"score": r.score, **r.payload} for r in results]

