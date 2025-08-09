from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS cart_item (
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id   UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity  INTEGER NOT NULL CHECK (quantity > 0),
    added_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, item_id)
);
""")

conn.commit()
cursor.close()
conn.close()
print("✅ Table for carts created successfully.")
