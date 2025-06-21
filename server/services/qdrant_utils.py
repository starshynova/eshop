import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from services.image_utils import get_image_vector_from_url, get_text_vector
from qdrant_client.models import NamedVector

client = QdrantClient(host="localhost", port=6333)

IMAGE_COLLECTION = "products_image"

def init_image_collection():
    if client.collection_exists(collection_name=IMAGE_COLLECTION):
        client.delete_collection(collection_name=IMAGE_COLLECTION)

    client.create_collection(
        collection_name=IMAGE_COLLECTION,
        vectors_config={
            "image": VectorParams(size=512, distance=Distance.COSINE)
        },
    )

def clean_payload(product: dict) -> dict:
    return {
        k: str(v) if isinstance(v, uuid.UUID) else v
        for k, v in product.items()
        if v is not None and isinstance(v, (str, int, float, bool))
    }

def add_products_with_image_vectors(products: list):
    points = []
    for product in products:
        vector = get_image_vector_from_url(product["main_photo_url"])
        if vector:
            print("✔️ Вектор:", len(vector))
            point = PointStruct(
                id=str(product["id"]),
                vector={"image": vector},
                payload=clean_payload(product),
            )
            points.append(point)

    print("📦 Загружаем", len(points), "векторов в Qdrant...")
    client.upsert(collection_name=IMAGE_COLLECTION, points=points)

def search_similar_images(image_url: str, top_k: int = 5, min_score: float = 0.52):
    vector = get_image_vector_from_url(image_url)
    if vector is None:
        raise ValueError("Не удалось извлечь вектор из изображения.")

    results = client.search(
        collection_name=IMAGE_COLLECTION,
        query_vector=NamedVector(name="image", vector=vector),  # Указываем имя вектора!
        limit=top_k,
        with_payload=True,
    )
    return [{"score": round(r.score, 4), **r.payload} for r in results if r.score > min_score]

def search_similar_images_by_text(query: str, top_k: int = 5, min_score: float = 0.2):
    vector = get_text_vector(query)
    if vector is None:
        raise ValueError("Не удалось извлечь текстовый вектор.")

    results = client.search(
        collection_name=IMAGE_COLLECTION,
        query_vector=NamedVector(name="image", vector=vector),  # Тот же вектор "image"
        limit=top_k,
        with_payload=True,
    )
    return [{"score": round(r.score, 4), **r.payload} for r in results if r.score > min_score]