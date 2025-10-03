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


## User features

1. Product catalogue with filtering by categories and subcategories
2. Detailed product page
3. Search by name and description
4. Shopping cart:
   - works for non-logged-in users (guest cart via localStorage)
   - cart synchronisation after login (cart from localStorage → to database)
   - product count badge on all pages
   - automatic clearing after payment
5. Order processing:
   - Stripe Payments (creation of PaymentIntent, front-end payment, confirmation)
   - saving the order after successful payment
6. Authorisation:
   - Email/password (with JWT tokens, bcrypt)
   - OAuth (Google)
7. User role:
   - user information
   - order history
   - changing personal data
8. Admin role:
   - adding, editing, and deleting products
   - user management
   - product and sales analytics

#### Release 2 - in process
This release includes responsive design and delivery functionality

#### Release 3
This release includes semantic search based on a vector database.

## Author
Project developed by Lidiia Starshynova
Email: **l.starshynova@gmail.com** 
