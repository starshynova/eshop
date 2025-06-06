from connectDB import conn

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    main_photo_url TEXT NOT NULL
);
""")

conn.commit()
cursor.close()
print("✅ Таблица 'items' успешно создана.")
