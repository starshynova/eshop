from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE users (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user',
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT 
        CHECK (
            first_name IS NULL 
            OR (char_length(first_name) >= 2 AND char_length(first_name) <= 30)
        ),
    last_name TEXT 
        CHECK (
            last_name IS NULL 
            OR (char_length(last_name) >= 2 AND char_length(last_name) <= 30)
        ),
    address_line1 TEXT,
    address_line2 TEXT,
    post_code TEXT 
        CHECK (
            post_code IS NULL 
            OR char_length(post_code) = 6
        ),
    city TEXT,
    created_date TIMESTAMP NOT NULL
);
""")

conn.commit()
cursor.close()
conn.close()
print("✅ Table 'users' created successfully.")
