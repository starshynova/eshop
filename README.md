You can try this app by visiting [ESHOP](https://eshop-star.netlify.app/)

## Overview

**ESHOP** is a powerful online store with advanced product search, category/subcategory support, a convenient shopping cart for guests and authorised users, secure payments, and a modern UI.
The project is built with React.ts, Tailwind, Python, FastAPI, PostgreSQL, and Stripe.


## Tech Stack

### Client side

1. React.ts
2. Tailwind CSS
3. React Context
4. React Router

### Server side

1. Python
2. FastAPI
3. PostgreSQL

### Third party service
1. Stripe


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
