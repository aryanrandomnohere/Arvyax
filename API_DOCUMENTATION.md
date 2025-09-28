# Arvyax Wellness Platform API Documentation

## Overview
A full-stack wellness session platform with authentication, auto-save functionality, and professional UI.

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, React Router, Axios, React Hot Toast
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB with Mongoose ODM

## API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ "message": "User registered successfully", "token": "jwt_token", "user": {...} }`

#### Login User
- **POST** `/api/auth/login`
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ "message": "Login successful", "token": "jwt_token", "user": {...} }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "user": {...} }`

### Session Endpoints

#### Get All Published Sessions
- **GET** `/api/sessions`
- **Access:** Public
- **Response:** `{ "message": "Published sessions retrieved successfully", "sessions": [...] }`

#### Get User's Sessions
- **GET** `/api/sessions/my-sessions`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "User sessions retrieved successfully", "sessions": [...] }`

#### Get Single Session
- **GET** `/api/sessions/my-sessions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Session retrieved successfully", "session": {...} }`

#### Save Draft Session
- **POST** `/api/sessions/my-sessions/save-draft`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "title": "Session Title", "tags": ["tag1", "tag2"], "jsonFileUrl": "https://example.com/data.json", "sessionId": "optional_id" }`
- **Response:** `{ "message": "Draft saved successfully", "session": {...} }`

#### Publish Session
- **POST** `/api/sessions/my-sessions/publish`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "sessionId": "session_id" }`
- **Response:** `{ "message": "Session published successfully", "session": {...} }`

#### Update Session
- **PUT** `/api/sessions/my-sessions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "title": "Updated Title", "tags": ["new", "tags"], "jsonFileUrl": "https://example.com/new-data.json" }`
- **Response:** `{ "message": "Session updated successfully", "session": {...} }`

#### Delete Session
- **DELETE** `/api/sessions/my-sessions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Session deleted successfully" }`

#### Check Edit Permission
- **GET** `/api/sessions/:id/can-edit`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "You can edit this session", "canEdit": true, "session": {...} }`

### Health Check
- **GET** `/api/health`
- **Response:** `{ "status": "OK", "message": "Arvyax Wellness Platform API is running", "timestamp": "..." }`

## Security Features

### Authentication & Authorization
- JWT-based authentication
- All private endpoints require valid Bearer token
- Users can only access their own sessions
- Session ownership verification middleware
- Protected routes with proper error handling

### Data Validation
- Input validation for all endpoints
- Email format validation
- Password strength requirements (minimum 6 characters)
- Required field validation
- Data sanitization

### Security Middleware
- `authenticateUser`: Verifies JWT tokens
- `verifySessionOwnership`: Ensures users can only modify their own sessions
- `verifySessionAccess`: Ensures users can only access their own sessions
- CORS configuration for secure cross-origin requests

## Environment Variables

### Backend (.env)
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/arvyax_wellness?authSource=admin
JWT_SECRET=arvyax_super_secret_jwt_key_2024_wellness_platform
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:4000
NODE_ENV=development
```

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── sessionController.js   # Session management logic
├── middleware/
│   ├── authentication.js      # JWT authentication
│   ├── sessionOwnership.js    # Session ownership verification
│   └── validation.js         # Input validation
├── models/
│   ├── User.js               # User model
│   └── Session.js            # Session model
├── routes/
│   ├── auth.js               # Authentication routes
│   └── sessions.js           # Session routes
├── .env                      # Environment variables
├── .env.example             # Environment template
└── server.js                # Main server file

frontend/
├── src/
│   ├── components/
│   │   └── Navbar.js         # Navigation component
│   ├── contexts/
│   │   └── AuthContext.js    # Authentication context
│   ├── pages/
│   │   ├── Dashboard.js      # Main dashboard
│   │   ├── Login.js          # Login page
│   │   ├── Register.js       # Registration page
│   │   ├── MySessions.js     # User's sessions
│   │   └── SessionEditor.js  # Session creation/editing
│   ├── .env                  # Environment variables
│   └── .env.example         # Environment template
└── package.json
```

## Key Features

### Frontend Features
- **React Hot Toast:** Beautiful autosave notifications
- **Search Functionality:** Real-time session search by title/tags
- **Auto-save:** Intelligent draft saving with session ID tracking
- **Professional UI:** Clean, modern design with smooth animations
- **Responsive Design:** Works on all device sizes

### Backend Features
- **RESTful API:** Clean, well-structured endpoints
- **Security First:** Comprehensive authentication and authorization
- **Error Handling:** Proper error responses and logging
- **Data Validation:** Input validation and sanitization
- **Professional Architecture:** Controllers, middleware, and routes separation

### Security Features
- **JWT Authentication:** Secure token-based authentication
- **Session Ownership:** Users can only access their own sessions
- **Input Validation:** Comprehensive data validation
- **CORS Protection:** Secure cross-origin request handling
- **Error Handling:** Secure error responses without data leakage

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm run install-all
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Update the values as needed
4. **Start MongoDB:**
   ```bash
   docker-compose up -d mongodb
   ```
5. **Start the application:**
   ```bash
   npm run dev
   ```

## API Testing

Use the following endpoints to test the API:

- **Health Check:** `GET http://localhost:4000/api/health`
- **Register:** `POST http://localhost:4000/api/auth/register`
- **Login:** `POST http://localhost:4000/api/auth/login`
- **Get Sessions:** `GET http://localhost:4000/api/sessions`

## Security Considerations

1. **All session operations are protected** with authentication
2. **Users can only access their own sessions** through ownership verification
3. **Input validation** prevents malicious data
4. **JWT tokens** provide secure authentication
5. **CORS configuration** prevents unauthorized cross-origin requests

This API provides a secure, scalable foundation for a wellness session platform with professional-grade security and architecture.
