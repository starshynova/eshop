You can try this app by visiting [ESHOP](https://eshop-star.netlify.app/)

#### Release 1
Desktop only

## Overview

**ESHOP** is a powerful online store with advanced product search, category/subcategory support, a convenient shopping cart for guests and authorised users, secure payments, and a modern UI.
The project is built with React.ts, Tailwind, Python, FastAPI, PostgreSQL, Stripe, OAuth, AWS S3.


## Tech Stack

### Client side

1. TypeScript
2. React
4. React Context
5. React Router
6. Tailwind CSS

### Server side

1. Python
2. FastAPI
3. PostgreSQL

### Third party service
1. Stripe

### Production
1. Client side - Netlify.com
2. Server side - Fly.io
3. Database - Neon.com


## Features
If you need administrator access, feel free to reach out to me via email.

### User Roles

1. Guest (Unregistered User)
   - Browse the product catalog and view detailed product information
   - Add products to the cart (cart is stored in LocalStorage)
   - Must register or log in to complete a purchase
2. Registered User
   - All guest features
   - Complete orders and pay online via Stripe (card number for successful payment - 4242 4242 4242 4242)
   - Cart is synchronized with the server and preserved between sessions
   - View order history
   - Update delivery contact information
   - Change/set password (for both email/password and Google authentication)
   - Secure logout
3. Administrator
   - Manage users (edit delivery details, change roles)
   - Manage products (add, edit, update images via AWS S3)
   - Access sales and order analytics
   - Manage product categories

### Core Features

1. Registration and Authentication
   - Email/password with email validation (JWT, bcrypt)
   - Google login (OAuth)
   - Guest cart is automatically migrated to the user’s account upon login
2. Cart
   - Stock availability is checked before adding or purchasing products
   - Out-of-stock items cannot be added to the cart
   - Cart automatically updates if product availability changes
   - If an item in the cart becomes unavailable, the user is notified and it is not included in the order total
3. Payment
   - Stripe integration: payment intent creation and transaction processing
4. Catalog and Search
   - Filtering by categories and subcategories
   - Search by product name and description (semantic search coming soon)
5. Analytics (Administrator):
   - General statistics: total orders, products sold, average, maximum, and minimum order value.
   - Top 10 best-selling products.
   - Sales by category.
   - Products with minimal stock (less than 5) and products with no sales.
   - Ability to navigate to product details directly from analytics charts.


#### Release 2 - in process
This release includes responsive design and delivery functionality

#### Release 3
This release includes semantic search based on a vector database.

## Author
Project developed by Lidiia Starshynova
Email: **l.starshynova@gmail.com** 
