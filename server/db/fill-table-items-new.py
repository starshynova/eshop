import uuid
from connectDB import get_connection

items = [
    # {
    #     "id": uuid.uuid4(),
    #     "title": "Essence Mascara Lash Princess",
    #     "price": 9.99,
    #     "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    #     "main_photo_url": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
    #     "stock": 99
    # },
    # {
    #     "id": uuid.uuid4(),
    #     "title": "Eyeshadow Palette with Mirror",
    #     "price": 19.99,
    #     "description": "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
    #     "main_photo_url": "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp",
    #     "stock": 34
    # },
    # {
    #     "id": uuid.uuid4(),
    #     "title": "Powder Canister",
    #     "price": 14.99,
    #     "description": "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
    #     "main_photo_url": "https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp"
    #     "stock": 89
    # },
    # {
    #     "id": uuid.uuid4(),
    #     "title": "Red Lipstick",
    #     "price": 12.99,
    #     "description": "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
    #     "main_photo_url": "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp",
    #     "stock": 91
    # },
    # {
    #     "id": uuid.uuid4(),
    #     "title": "Red Nail Polish",
    #     "price": 8.99,
    #     "description": "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
    #     "main_photo_url": "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp",
    #     "stock": 79
    # },
    # {
    #   "id": uuid.uuid4(),
    #   "title": "Calvin Klein CK One",
    #   "price": 49.99,
    #   "description": "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
    #   "main_photo_url": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp",
    #   "stock": 29
    # },
    # {
    #   "id": uuid.uuid4(),
    #   "title": "Chanel Coco Noir Eau De",
    #   "price": 129.99,
    #   "description": "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
    #   "main_photo_url": "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp",
    #   "stock": 58
    # },
    # {
    #   "id": uuid.uuid4(),
    #   "title": "Dior J'adore",
    #   "price": 89.99,
    #   "description": "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
    #   "main_photo_url": "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/1.webp",
    #   "stock": 98
    # },
    # {
    #   "id": uuid.uuid4(),
    #   "title": "Dolce Shine Eau de",
    #   "price": 69.99,
    #   "description": "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
    #   "main_photo_url": "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp",
    #   "stock": 4
    # },
    # {
    #   "id": uuid.uuid4(),
    #   "title": "Gucci Bloom Eau de",
    #   "price": 79.99,
    #   "description": "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
    #   "main_photo_url": "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/1.webp",
    #   "stock": 91
    # },
    {
      "id": uuid.uuid4(),
      "title": "Decoration Swing",
      "price": 59.99,
      "description": "The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/1.webp",
      "stock": 47
    },
    {
      "id": uuid.uuid4(),
      "title": "Family Tree Photo Frame",
      "price": 29.99,
      "description": "The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/1.webp",
      "stock": 77
    },
    {
      "id": uuid.uuid4(),
      "title": "House Showpiece Plant",
      "price": 39.99,
      "description": "The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/1.webp",
      "stock": 28
    },
    {
      "id": uuid.uuid4(),
      "title": "Plant Pot",
      "price": 14.99,
      "description": "The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/1.webp",
      "stock": 59
    },
    {
      "id": uuid.uuid4(),
      "title": "Table Lamp",
      "price": 49.99,
      "description": "The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/1.webp",
      "stock": 9
    },
    {
      "id": uuid.uuid4(),
      "title": "Bamboo Spatula",
      "price": 7.99,
      "description": "The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/1.webp",
      "stock": 37
    },
    {
      "id": uuid.uuid4(),
      "title": "Black Aluminium Cup",
      "price": 5.99,
      "description": "The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/1.webp",
      "stock": 75
    },
    {
      "id": uuid.uuid4(),
      "title": "Black Whisk",
      "price": 9.99,
      "description": "The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/1.webp",
      "stock": 73
    },
    {
      "id": uuid.uuid4(),
      "title": "Boxed Blender",
      "price": 39.99,
      "description": "The Boxed Blender is a powerful and compact blender perfect for smoothies, shakes, and more. Its convenient design and multiple functions make it a versatile kitchen appliance.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/1.webp",
      "stock": 9
    },
    {
      "id": uuid.uuid4(),
      "title": "Carbon Steel Wok",
      "price": 29.99,
      "description": "The Carbon Steel Wok is a versatile cooking pan suitable for stir-frying, sautéing, and deep frying. Its sturdy construction ensures even heat distribution for delicious meals.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/1.webp",
      "stock": 40
    },
    {
      "id": uuid.uuid4(),
      "title": "Chopping Board",
      "price": 12.99,
      "description": "The Chopping Board is an essential kitchen accessory for food preparation. Made from durable material, it provides a safe and hygienic surface for cutting and chopping.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/1.webp",
      "stock": 14
    },
    {
      "id": uuid.uuid4(),
      "title": "Citrus Squeezer Yellow",
      "price": 8.99,
      "description": "The Citrus Squeezer in Yellow is a handy tool for extracting juice from citrus fruits. Its vibrant color adds a cheerful touch to your kitchen gadgets.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/1.webp",
      "stock": 22
    },
    {
      "id": uuid.uuid4(),
      "title": "Egg Slicer",
      "price": 6.99,
      "description": "The Egg Slicer is a convenient tool for slicing boiled eggs evenly. It's perfect for salads, sandwiches, and other dishes where sliced eggs are desired.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/1.webp",
      "stock": 40
    },
    {
      "id": uuid.uuid4(),
      "title": "Electric Stove",
      "price": 49.99,
      "description": "The Electric Stove provides a portable and efficient cooking solution. Ideal for small kitchens or as an additional cooking surface for various culinary needs.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/1.webp",
      "stock": 21
    },
    {
      "id": uuid.uuid4(),
      "title": "Fine Mesh Strainer",
      "price": 9.99,
      "description": "The Fine Mesh Strainer is a versatile tool for straining liquids and sifting dry ingredients. Its fine mesh ensures efficient filtering for smooth cooking and baking.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/1.webp",
      "stock": 85
    },
    {
      "id": uuid.uuid4(),
      "title": "Fork",
      "price": 3.99,
      "description": "The Fork is a classic utensil for various dining and serving purposes. Its durable and ergonomic design makes it a reliable choice for everyday use.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/1.webp",
      "stock": 7
    },
    {
      "id": uuid.uuid4(),
      "title": "Glass",
      "price": 4.99,
      "description": "The Glass is a versatile and elegant drinking vessel suitable for a variety of beverages. Its clear design allows you to enjoy the colors and textures of your drinks.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/1.webp",
      "stock": 46
    },
    {
      "id": uuid.uuid4(),
      "title": "Grater Black",
      "price": 10.99,
      "description": "The Grater in Black is a handy kitchen tool for grating cheese, vegetables, and more. Its sleek design and sharp blades make food preparation efficient and easy.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/1.webp",
      "stock": 84
    },
    {
      "id": uuid.uuid4(),
      "title": "Hand Blender",
      "price": 34.99,
      "description": "The Hand Blender is a versatile kitchen appliance for blending, pureeing, and mixing. Its compact design and powerful motor make it a convenient tool for various recipes.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/hand-blender/1.webp",
      "stock": 84,
    },
    {
      "id": uuid.uuid4(),
      "title": "Ice Cube Tray",
      "price": 5.99,
      "description": "The Ice Cube Tray is a practical accessory for making ice cubes in various shapes. Perfect for keeping your drinks cool and adding a fun element to your beverages.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/ice-cube-tray/1.webp",
      "stock": 13
    },
    {
      "id": uuid.uuid4(),
      "title": "Kitchen Sieve",
      "price": 7.99,
      "description": "The Kitchen Sieve is a versatile tool for sifting and straining dry and wet ingredients. Its fine mesh design ensures smooth results in your cooking and baking.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/kitchen-sieve/1.webp",
      "stock": 68
    },
    {
      "id": uuid.uuid4(),
      "title": "Knife",
      "price": 14.99,
      "description": "The Knife is an essential kitchen tool for chopping, slicing, and dicing. Its sharp blade and ergonomic handle make it a reliable choice for food preparation.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/knife/1.webp",
      "stock": 7
    },
    {
      "id": uuid.uuid4(),
      "title": "Lunch Box",
      "price": 12.99,
      "description": "The Lunch Box is a convenient and portable container for packing and carrying your meals. With compartments for different foods, it's perfect for on-the-go dining.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/1.webp",
      "stock": 94
    },
    {
      "id": uuid.uuid4(),
      "title": "Microwave Oven",
      "price": 89.99,
      "description": "The Microwave Oven is a versatile kitchen appliance for quick and efficient cooking, reheating, and defrosting. Its compact size makes it suitable for various kitchen setups.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/microwave-oven/1.webp",
      "stock": 59
    },
    {
      "id": uuid.uuid4(),
      "title": "Mug Tree Stand",
      "price": 15.99,
      "description": "The Mug Tree Stand is a stylish and space-saving solution for organizing your mugs. Keep your favorite mugs easily accessible and neatly displayed in your kitchen.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/mug-tree-stand/1.webp",
      "stock": 88
    },
    {
      "id": uuid.uuid4(),
      "title": "Pan",
      "price": 24.99,
      "description": "The Pan is a versatile and essential cookware item for frying, sautéing, and cooking various dishes. Its non-stick coating ensures easy food release and cleanup.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/pan/1.webp",
      "stock": 90
    },
    {
      "id": uuid.uuid4(),
      "title": "Plate",
      "price": 3.99,
      "description": "The Plate is a classic and essential dishware item for serving meals. Its durable and stylish design makes it suitable for everyday use or special occasions.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/plate/1.webp",
      "stock": 66
    },
    {
      "id": uuid.uuid4(),
      "title": "Red Tongs",
      "price": 6.99,
      "description": "The Red Tongs are versatile kitchen tongs suitable for various cooking and serving tasks. Their vibrant color adds a pop of excitement to your kitchen utensils.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/red-tongs/1.webp",
      "stock": 82
    },
    {
      "id": uuid.uuid4(),
      "title": "Silver Pot With Glass Cap",
      "price": 39.99,
      "description": "The Silver Pot with Glass Cap is a stylish and functional cookware item for boiling, simmering, and preparing delicious meals. Its glass cap allows you to monitor cooking progress.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/1.webp",
      "stock": 40
    },
    {
      "id": uuid.uuid4(),
      "title": "Slotted Turner",
      "price": 8.99,
      "description": "The Slotted Turner is a kitchen utensil designed for flipping and turning food items. Its slotted design allows excess liquid to drain, making it ideal for frying and sautéing.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/slotted-turner/1.webp",
      "stock": 88
    },
    {
      "id": uuid.uuid4(),
      "title": "Spice Rack",
      "price": 19.99,
      "description": "The Spice Rack is a convenient organizer for your spices and seasonings. Keep your kitchen essentials within reach and neatly arranged with this stylish spice rack.",
      "main_photo_url": 
        "https://cdn.dummyjson.com/product-images/kitchen-accessories/spice-rack/1.webp",
      "stock": 79
    },
    {
      "id": uuid.uuid4(),
      "title": "Spoon",
      "price": 4.99,
      "description": "The Spoon is a versatile kitchen utensil for stirring, serving, and tasting. Its ergonomic design and durable construction make it an essential tool for every kitchen.",
      "main_photo_url": "https://cdn.dummyjson.com/product-images/kitchen-accessories/spoon/1.webp",
      "stock": 59
    },
    {
      "id": uuid.uuid4(),
      "title": "Tray",
      "price": 16.99,
      "description": "The Tray is a functional and decorative item for serving snacks, appetizers, or drinks. Its stylish design makes it a versatile accessory for entertaining guests.",
      "main_photo_url": "https://cdn.dummyjson.com/product-images/kitchen-accessories/tray/1.webp",
      "stock": 71
    },
    {
      "id": uuid.uuid4(),
      "title": "Wooden Rolling Pin",
      "price": 11.99,
      "description": "The Wooden Rolling Pin is a classic kitchen tool for rolling out dough for baking. Its smooth surface and sturdy handles make it easy to achieve uniform thickness.",
      "main_photo_url": "https://cdn.dummyjson.com/product-images/kitchen-accessories/wooden-rolling-pin/1.webp",
      "stock": 80
    },
    {
      "id": uuid.uuid4(),
      "title": "Yellow Peeler",
      "price": 5.99,
      "description": "The Yellow Peeler is a handy tool for peeling fruits and vegetables with ease. Its bright yellow color adds a cheerful touch to your kitchen gadgets.",
      "main_photo_url": "https://cdn.dummyjson.com/product-images/kitchen-accessories/yellow-peeler/1.webp",
      "stock": 35
    },
]

conn = get_connection()
cursor = conn.cursor()

for item in items:
    cursor.execute("""
        INSERT INTO items (id, title, price, description, main_photo_url, stock)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (str(item["id"]), item["title"], item["price"], item["description"], item["main_photo_url"], item["stock"]))

conn.commit()
cursor.close()
conn.close()

print("✅ The items table is filled with new initial data..")
