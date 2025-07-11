import uuid
from connectDB import get_connection

items = [
    {
        "id": uuid.uuid4(),
        "title": "Black pants",
        "price": 59,
        "description": "Black wide pants for ladies",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-01.jpg",
        "quantity": 5
    },
    {
        "id": uuid.uuid4(),
        "title": "Burgundy pants",
        "price": 69,
        "description": "Burgundy wide pants for ladies",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-02.jpg",
        "quantity": 7
    },
    {
        "id": uuid.uuid4(),
        "title": "Blue shirt and pants",
        "price": 89,
        "description": " Blue shirt and pants set ",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-03.jpg",
        "quantity": 4
    },
{
        "id": uuid.uuid4(),
        "title": "Beige shirt and pants",
        "price": 99,
        "description": "Set of shirt and pants",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-04.jpg",
        "quantity": 5
    },
{
        "id": uuid.uuid4(),
        "title": "White shirt and skirt",
        "price": 69,
        "description": "White shirt and midi-skirt",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-05.jpg",
        "quantity": 12
    },
{
        "id": uuid.uuid4(),
        "title": "White dress",
        "price": 129,
        "description": "Nice white dress",
        "main_photo_url": "https://e-commerce-img.s3.eu-north-1.amazonaws.com/img-06.jpg",
        "quantity": 15
    },
]

conn = get_connection()
cursor = conn.cursor()

for item in items:
    cursor.execute("""
        INSERT INTO items (id, title, price, description, main_photo_url, quantity)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (str(item["id"]), item["title"], item["price"], item["description"], item["main_photo_url"], item["quantity"]))

conn.commit()
cursor.close()
conn.close()

print("✅ The items table is filled with initial data..")
