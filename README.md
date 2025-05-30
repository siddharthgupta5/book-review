# Book Review API

A RESTful API built with Node.js and Express for managing book reviews. This API allows users to register, login, add books, submit reviews, and search for books.

## 🚀 Features

- User Authentication (JWT)
- Book Management
- Review System
- Search Functionality
- Pagination
- Error Handling
- Input Validation

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for Authentication
- Express Validator
- Morgan (for logging)
- Bcryptjs (for password hashing)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Get All Books
```http
GET /api/books?page=1&limit=10&author=John&genre=Fiction
```

#### Get Single Book
```http
GET /api/books/:id
```

#### Add New Book (Protected)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "description": "A story of the fabulously wealthy Jay Gatsby..."
}
```

### Reviews

#### Get Book Reviews
```http
GET /api/books/:bookId/reviews?page=1&limit=10
```

#### Add Review (Protected)
```http
POST /api/books/:bookId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book!"
}
```

#### Update Review (Protected)
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete Review (Protected)
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

### Search

#### Search Books
```http
GET /api/search?q=great&page=1&limit=10
```

## 📊 Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Book
```javascript
{
  title: String,
  author: String,
  genre: String,
  description: String,
  createdAt: Date
}
```

### Review
```javascript
{
  rating: Number,
  comment: String,
  book: ObjectId (ref: 'Book'),
  user: ObjectId (ref: 'User'),
  createdAt: Date
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

## 📝 Design Decisions

1. **MongoDB**: Chosen for its flexibility with document-based storage and easy integration with Node.js
2. **JWT**: Selected for stateless authentication and scalability
3. **Express Validator**: Used for input validation and sanitization
4. **Mongoose**: Provides schema validation and type checking
5. **Pagination**: Implemented for better performance with large datasets
6. **Error Handling**: Centralized error handling with custom error responses

## 🧪 Testing

Run tests using:
```bash
npm test
```

## 📦 Project Structure

```
book-review-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   ├── errorResponse.js
│   │   └── paginate.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

<!-- ## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.  -->