# E-Commerce Website

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce website with admin panel functionality.

## Features

### User Features
- User authentication (Signup/Login) with JWT
- Browse products by category
- Search products
- Product detail pages with image gallery
- Shopping cart functionality
- Checkout process
- Order history
- Responsive design

### Admin Features
- Admin dashboard with statistics
- Add/Edit/Delete products
- Product image upload (3-5 images per product) using Cloudinary
- Order management
- View traffic and analytics
- Order status management

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- ES Modules (ESM)

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Vite
- Lucide React icons

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
e-commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── db/              # Database connection
│   │   ├── middlewares/    # Auth & upload middlewares
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Cloudinary utilities
│   ├── app.js
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # API client
│   │   └── assets/          # Images and static files
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/me` - Get current user

### Products
- `GET /api/v1/products` - Get all products (with pagination, search, category filter)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/categories` - Get all categories
- `POST /api/v1/products` - Create product (Admin only)
- `PUT /api/v1/products/:id` - Update product (Admin only)
- `DELETE /api/v1/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my-orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders` - Get all orders (Admin only)
- `PUT /api/v1/orders/:id/status` - Update order status (Admin only)

### Admin
- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/traffic` - Get traffic statistics

## Creating an Admin User

To create an admin user, you need to manually update the database:

1. Register a user normally through the signup page
2. Connect to your MongoDB database
3. Update the user document:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Notes

- Product images must be between 3-5 images per product
- Images are uploaded to Cloudinary
- Authentication uses JWT tokens stored in HTTP-only cookies
- Cart is stored in localStorage
- All prices are in Indian Rupees (₹)
