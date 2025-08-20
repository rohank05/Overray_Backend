# Overray Backend

A comprehensive e-commerce backend API built with Node.js, Express, GraphQL, and MongoDB. This application provides a complete backend solution for an online marketplace with features including user authentication, product management, shopping cart, wishlist, order processing, and payment integration.

## Features

- **User Authentication & Authorization**: JWT-based authentication with secure user management
- **GraphQL API**: Efficient data fetching with GraphQL queries and mutations
- **Product Management**: Complete CRUD operations for products with categories and images
- **Shopping Cart**: Add, update, remove items with inventory validation
- **Wishlist**: Save favorite products for later purchase
- **Order Processing**: Full order lifecycle management with payment integration
- **Payment Integration**: Razorpay integration for secure payments
- **Email Notifications**: Automated email system using SendGrid
- **File Upload**: Multer integration for image uploads
- **Admin Panel**: Administrative interface for backend management
- **Input Validation**: Comprehensive input validation using Joi
- **Error Handling**: Centralized error handling and logging
- **Testing**: Jest-based testing framework with coverage reports
- **Code Quality**: ESLint configuration for consistent code style

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: GraphQL with Apollo Server
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Payment**: Razorpay
- **Email**: SendGrid
- **Testing**: Jest
- **Linting**: ESLint
- **Logging**: Pino

## Project Structure

```
src/
├── business/                 # Business logic and configurations
│   ├── business-base.js
│   ├── business-object-config.js
│   └── overrides/
├── constants/                # Application constants
│   └── index.js
├── controllers/              # Route controllers
│   ├── auth.js
│   └── utils.js
├── database/                 # Database configurations and schemas
│   ├── databaseOperations.js
│   ├── exceptionMapping.js
│   └── schemas/
├── email-templates/          # Email templates
├── graphql/                  # GraphQL schema and resolvers
│   ├── resolvers.js
│   └── typeDefs.js
├── middleware/               # Custom middleware
│   └── jwtHelper.js
├── routes/                   # REST API routes
│   ├── admin/
│   ├── auth.js
│   ├── checkout.js
│   ├── index.js
│   ├── notification.js
│   └── order.js
├── services/                 # Business logic services
│   ├── cartService.js
│   └── wishlistService.js
├── utils/                    # Utility functions
│   ├── firebase.js
│   ├── logger.js
│   ├── otpless.js
│   └── shiprocket.js
├── validators/               # Input validation schemas
│   └── inputValidation.js
└── index.js                  # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rohank05/Overray_Backend.git
cd Overray_Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/overray
JWT_SECRET=your_jwt_secret
RAZOR_PAY_KEY_ID=your_razorpay_key_id
RAZOR_PAY_KEY_SECRET=your_razorpay_key_secret
SEND_GRID_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_sender_email
```

5. Start the development server:
```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### REST Endpoints
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `POST /v1/checkout/initiate` - Initiate checkout process
- `GET /v1/orders` - Get user orders
- `POST /v1/notification` - Handle notifications

### GraphQL Endpoint
- `POST /v1/graphql` - GraphQL API endpoint

### Admin Endpoints
- `POST /v1/admin/:businessObjectName/list` - List business objects
- `POST /v1/admin/:businessObjectName/save` - Save business object
- `POST /v1/admin/:businessObjectName/delete` - Delete business object
- `GET /v1/admin/:businessObjectName/:id` - Get business object by ID

## GraphQL Operations

### Queries
```graphql
# Get user's cart
query GetCart {
  cart {
    products {
      productId {
        name
        price
        images
      }
      quantity
    }
  }
}

# Get user's wishlist
query GetWishlist {
  wishlist {
    products {
      name
      price
      images
    }
  }
}

# Get products with filters
query GetProducts($filter: ProductFilter) {
  products(filter: $filter) {
    _id
    name
    price
    discount
    categories
    images
  }
}
```

### Mutations
```graphql
# Add product to cart
mutation AddToCart($products: CartInput!) {
  addProductToCart(products: $products) {
    _id
    products {
      productId
      quantity
    }
  }
}

# Add product to wishlist
mutation AddToWishlist($product_id: ID!) {
  addProductToWishlist(product_id: $product_id) {
    _id
    products
  }
}
```

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

Check code quality:
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Development

### Adding New Features

1. **Services**: Add business logic to `src/services/`
2. **Validation**: Add input validation schemas to `src/validators/`
3. **Constants**: Add new constants to `src/constants/`
4. **Tests**: Add tests to `__tests__/` directory
5. **Documentation**: Update API documentation

### Error Handling

The application uses centralized error handling with custom error codes and messages defined in `src/constants/index.js`.

### Logging

Application uses Pino for structured logging. Logs are written to console and files based on configuration.

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-mongo-host:27017/overray
JWT_SECRET=your-secure-jwt-secret
# ... other environment variables
```

### Production Build

The application runs directly from source. Ensure Node.js v18+ is installed in production.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Ensure code passes linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the GitHub repository.