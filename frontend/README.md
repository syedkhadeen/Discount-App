# FoodDiscount - Food Deals & Discounts Platform

A modern web application for discovering and accessing food deals and discounts from local restaurants.

## Features

- 🔐 **Authentication System**: Secure login and registration with NextAuth.js
- 🍕 **Deals Discovery**: Browse amazing food deals and discounts
- 🏪 **Restaurant Directory**: Explore local restaurants with ratings and delivery info
- 👤 **User Dashboard**: Personalized experience with order history and preferences
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with Tailwind CSS

## Authentication Flow

### Registration Process
1. Users can register via `/register` page
2. Form validation ensures data quality
3. Users are automatically logged in after successful registration
4. Redirected to dashboard or intended page

### Login Process
1. Users can login via `/login` page
2. Support for both email/password and Google OAuth
3. Proper error handling and user feedback
4. Redirected to dashboard or intended page

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/profile` - User profile management (requires authentication)

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/deals` - Browse deals
- `/restaurants` - Browse restaurants

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-discount
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
food-discount/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth configuration
│   ├── dashboard/         # User dashboard
│   ├── deals/            # Deals page
│   ├── login/            # Login page
│   ├── profile/          # User profile
│   ├── register/         # Registration page
│   ├── restaurants/      # Restaurants page
│   └── layout.js         # Root layout
├── components/           # Reusable components
├── middleware.js         # Route protection
└── tailwind.config.js    # Tailwind configuration
```

## Authentication Features

### User Registration
- Email and password validation
- Password confirmation
- Automatic login after registration
- Toast notifications for feedback

### User Login
- Email/password authentication
- Google OAuth integration
- Remember me functionality
- Proper error handling

### Session Management
- JWT-based sessions
- Automatic session refresh
- Protected route middleware
- User profile management

## Styling

The project uses Tailwind CSS with a custom color scheme optimized for food-related applications:

- **Primary**: Tomato red (#E53935)
- **Secondary**: Warm orange (#FB8C00)
- **Accent**: Lemon yellow (#FDD835)
- **Background**: Warm off-white (#FFF8F0)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Technologies

- **Next.js 15** - React framework
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
