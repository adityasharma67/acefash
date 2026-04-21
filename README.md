# AceFash Full-Stack eCommerce App

Modern eCommerce web application with:

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Redux Toolkit
- Backend: Node.js + Express + MongoDB (Mongoose)
- Authentication: JWT + bcrypt password hashing
- Features: Product CRUD, cart, checkout, order history, admin dashboard, image upload, role-based access

## Folder Structure

```text
acefash/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── uploads/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Backend Setup

1. Go to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env` values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/acefash
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

5. Optional: seed admin account:

```bash
npm run seed:admin
```

6. Start backend:

```bash
npm run dev
```

## Frontend Setup

1. Go to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env` values:

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

5. Start frontend:

```bash
npm run dev
```

## Build Commands

- Frontend production build:

```bash
cd frontend && npm run build
```

- Backend production run:

```bash
cd backend && npm start
```

## Core Features Implemented

- User authentication (register/login/logout)
- JWT-based protected routes
- Role-based access (`admin` and `user`)
- Admin product CRUD with image upload
- Product listing with search + category filters
- Cart with quantity updates and persistent local storage
- Checkout and order creation (mock payment)
- User order history
- Admin order management
- Responsive modern UI
- Framer Motion animations
- Toast notifications
- API security middleware (`helmet`, rate limiter, CORS)

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders` (admin)
- `POST /api/upload/image` (admin)

## Notes

- Existing static HTML files in the repository are untouched.
- Image uploads are currently local (`backend/src/uploads`).
- Stripe is not wired yet; checkout currently uses mock payment flow.
