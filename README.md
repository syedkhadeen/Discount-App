# 🎟️ Discount App - Multi-Vendor Discount & Coupon Platform

A comprehensive full-stack web application for managing discounts, coupons, and deals across restaurants and clothing stores. Features role-based access control for users, vendors, and administrators with real-time coupon management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👤 For Users
- **Secure Authentication**: Email verification with JWT-based authentication
- **Coupon Generation**: Generate unique discount coupons (1 per restaurant/week)
- **Deal Discovery**: Browse restaurants and clothing stores with active deals
- **Coupon Management**: Track all generated coupons with status updates
- **User Dashboard**: Personalized dashboard with order history and preferences
- **Responsive Design**: Seamless experience across all devices

### 🏪 For Vendors (Restaurants & Clothing Stores)
- **Vendor Portal**: Dedicated login portal for business owners
- **Coupon Search**: Advanced search and filter by code, status, or date
- **Coupon Redemption**: Mark coupons as redeemed with usage notes
- **Real-time Updates**: Instant coupon status synchronization
- **Analytics Dashboard**: View redemption statistics and trends

### 👨‍💼 For Administrators
- **User Management**: Complete CRUD operations on users
- **Vendor Management**: Add, update, and delete restaurants/stores
- **Coupon Oversight**: Monitor and manage all coupons system-wide
- **System Statistics**: Real-time analytics and reporting
- **Audit Trails**: Track all system activities and changes
- **Role Management**: Assign and modify user roles

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) 11.x - Progressive Node.js framework
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication**: JWT with Passport.js strategy
- **Validation**: class-validator & class-transformer
- **Security**: bcryptjs, Helmet, CORS
- **API**: RESTful architecture with global prefix `/api`

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 15.x with React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.x
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) v4
- **UI Components**: Headless UI, Heroicons, React Icons
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **State Management**: React Hooks & Context API

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest (Backend), React Testing Library (Frontend)

## 🏗️ Architecture

```
discount-app/
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── auth/              # Authentication & JWT strategy
│   │   ├── users/             # User management module
│   │   ├── restaurants/       # Restaurant CRUD operations
│   │   ├── clothing/          # Clothing store management
│   │   ├── coupons/           # Coupon generation & validation
│   │   ├── codes/             # Discount code management
│   │   ├── discounts/         # Discount rules engine
│   │   ├── redemptions/       # Redemption tracking
│   │   ├── reviews/           # Review & rating system
│   │   ├── common/            # Shared utilities & guards
│   │   ├── config/            # Configuration modules
│   │   └── main.ts            # Application entry point
│   ├── scripts/               # Database seeding & admin setup
│   ├── test/                  # E2E tests
│   └── dist/                  # Production build
│
├── frontend/                  # Next.js Client Application
│   ├── app/
│   │   ├── api/auth/         # NextAuth configuration
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── deals/            # Deals browsing page
│   │   ├── restaurants/      # Restaurant directory
│   │   ├── clothing/         # Clothing store directory
│   │   ├── coupons/          # Coupon management
│   │   ├── restaurant-portal/ # Restaurant vendor portal
│   │   ├── clothing-portal/  # Clothing vendor portal
│   │   ├── login/            # Authentication pages
│   │   ├── register/         # User registration
│   │   └── profile/          # User profile management
│   ├── components/           # Reusable React components
│   ├── lib/                  # API services & utilities
│   ├── public/               # Static assets
│   └── middleware.js         # Route protection & auth
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB** 6.x or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/syedkhadeen/Discount-App.git
cd Discount-App
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Environment Variables

Create `backend/.env`:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/discount_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

#### Frontend Environment Variables

Create `frontend/.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-characters-long

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Setup

1. **Start MongoDB** (if running locally):
```bash
mongod
```

2. **Create Admin User**:
```bash
cd backend
node scripts/create-admin.js
```

This creates an admin account:
- **Email**: syed.khadeen@gmail.com
- **Password**: admin123
- **Role**: ADMIN

⚠️ **Important**: Change the admin password after first login!

### Running the Application

#### Development Mode

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

#### Production Mode

**Backend**:
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/discount_app` |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `PORT` | Backend server port | No | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXTAUTH_URL` | NextAuth base URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | Yes | - |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:3001/api` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No | - |

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/set-password
GET  /api/auth/profile
```

#### Vendor Authentication
```http
POST /api/restaurants/login
POST /api/clothing/login
```

#### Admin Authentication
```http
POST /api/auth/admin/login
```

### Resource Endpoints

#### Restaurants
```http
GET    /api/restaurants          # Get all restaurants
POST   /api/restaurants          # Create restaurant (admin)
GET    /api/restaurants/:id      # Get restaurant by ID
PATCH  /api/restaurants/:id      # Update restaurant
DELETE /api/restaurants/:id      # Delete restaurant (admin)
```

#### Clothing Stores
```http
GET    /api/clothing             # Get all stores
POST   /api/clothing             # Create store (admin)
GET    /api/clothing/:id         # Get store by ID
PATCH  /api/clothing/:id         # Update store
DELETE /api/clothing/:id         # Delete store (admin)
```

#### Coupons
```http
POST   /api/coupons/generate     # Generate coupon (user)
POST   /api/coupons/validate     # Validate coupon code
POST   /api/coupons/redeem       # Redeem coupon (vendor)
GET    /api/coupons/my-coupons   # Get user coupons
GET    /api/coupons/restaurant-coupons  # Get vendor coupons
GET    /api/coupons/search       # Search coupons (vendor)
```

#### Admin Operations
```http
GET    /api/admin/users          # Get all users
DELETE /api/admin/users/:id      # Delete user
GET    /api/admin/restaurants    # Get all restaurants
DELETE /api/admin/restaurants/:id # Delete restaurant
GET    /api/admin/coupons        # Get all coupons
DELETE /api/admin/coupons/:id    # Delete coupon
GET    /api/admin/stats          # System statistics
```

### Request/Response Examples

#### Generate Coupon
```bash
curl -X POST http://localhost:3001/api/coupons/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "507f1f77bcf86cd799439011",
    "discountPercentage": 20
  }'
```

Response:
```json
{
  "code": "DISC-ABC123",
  "restaurantId": "507f1f77bcf86cd799439011",
  "discountPercentage": 20,
  "status": "active",
  "validFrom": "2026-04-20T00:00:00.000Z",
  "validUntil": "2026-04-27T23:59:59.999Z"
}
```

## 🌐 Deployment

### Production Checklist

- [ ] Change all default passwords and secrets
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Set strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set up environment variables on hosting platform
- [ ] Enable rate limiting and security headers
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Test all authentication flows
- [ ] Review and update admin credentials

### Deployment Platforms

#### Backend (NestJS)

**Recommended Platforms**:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

**Build Command**: `npm run build`
**Start Command**: `npm run start:prod`

#### Frontend (Next.js)

**Recommended Platforms**:
- [Vercel](https://vercel.com/) (Recommended - built by Next.js creators)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

**Build Command**: `npm run build`
**Start Command**: `npm start`

#### Database

**Recommended**:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- [AWS DocumentDB](https://aws.amazon.com/documentdb/)

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: discount_app

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/discount_app
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3001
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001/api
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

## 🔒 Security

### Implemented Security Features

- **Authentication**: JWT-based with secure token storage
- **Password Hashing**: bcrypt with salt rounds (10)
- **Role-Based Access Control (RBAC)**: User, Vendor, Admin roles
- **Input Validation**: class-validator DTOs on all endpoints
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers middleware
- **Rate Limiting**: Built-in protection against brute force
- **SQL Injection Prevention**: MongoDB with Mongoose ODM
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: NextAuth.js built-in protection

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong secrets** (min 32 characters, random)
3. **Enable HTTPS** in production
4. **Regularly update dependencies**: `npm audit fix`
5. **Implement rate limiting** on authentication endpoints
6. **Monitor logs** for suspicious activity
7. **Use environment-specific configs**
8. **Implement backup strategy** for database
9. **Regular security audits**
10. **Keep Node.js and dependencies updated**

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm run test

# Watch mode
npm run test:watch
```

## 📖 User Guides

### For Users

1. **Registration**: Visit `/register` and create an account
2. **Email Verification**: Enter the verification code sent to your email
3. **Browse Deals**: Explore restaurants and clothing stores at `/deals`
4. **Generate Coupon**: Click "Generate Coupon" on any vendor (once per week)
5. **View Coupons**: Check your coupons in `/dashboard`
6. **Redeem**: Show coupon code to vendor for redemption

### For Vendors

1. **Login**: Access vendor portal at `/restaurant-portal` or `/clothing-portal`
2. **Search Coupons**: Use search bar to find coupons by code
3. **Validate**: Check coupon validity before accepting
4. **Redeem**: Mark coupon as redeemed with optional notes
5. **View History**: Track all redeemed coupons

### For Administrators

1. **Login**: Access admin panel at `/admin`
2. **Manage Users**: View, edit, or delete user accounts
3. **Manage Vendors**: Add new restaurants/stores or update existing
4. **Monitor Coupons**: View all coupons and their status
5. **View Analytics**: Check system statistics and trends

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run linters before committing: `npm run lint`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Syed Khadeen** - [GitHub](https://github.com/syedkhadeen)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/syedkhadeen/Discount-App/issues)
- **Email**: syed.khadeen@gmail.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications for coupon expiry
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Loyalty points system
- [ ] Social media sharing
- [ ] Push notifications
- [ ] QR code generation for coupons
- [ ] Vendor analytics dashboard

---

**Made with ❤️ by Syed Khadeen**
