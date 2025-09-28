# 🧘 Arvyax Wellness Session Platform

A full-stack wellness session platform built with Node.js, Express, MongoDB, and React. Features secure authentication, session management, auto-save drafts, and a modern responsive UI.

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Persistent login sessions

### 📘 Session Management
- Create, edit, and publish wellness sessions
- Draft system with auto-save functionality
- Tag-based organization
- JSON file URL integration
- Public session browsing

### 🎨 Frontend Features
- Modern, responsive React UI
- Real-time auto-save with visual feedback
- Toast notifications for user feedback
- Protected route handling
- Mobile-friendly design

### 🚀 Backend Features
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT-based authentication
- Input validation and error handling
- CORS enabled for frontend integration

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling with modern features

### DevOps
- **Docker** - MongoDB containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd arvyax-wellness-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Start MongoDB with Docker
```bash
# Start MongoDB container
docker-compose up -d mongodb

# Verify MongoDB is running
docker ps
```

The MongoDB instance will be available at:
- **Host**: localhost
- **Port**: 27017
- **Database**: arvyax_wellness
- **Username**: admin
- **Password**: password123

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:
```bash
# Backend environment
cd backend
cp .env.example .env

# Frontend environment  
cd ../frontend
cp .env.example .env
```

**Backend .env:**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/arvyax_wellness?authSource=admin
JWT_SECRET=arvyax_super_secret_jwt_key_2024_wellness_platform
CORS_ORIGIN=http://localhost:3000
```

**Frontend .env:**
```env
REACT_APP_API_URL=http://localhost:4000
NODE_ENV=development
```

### 5. Start the Application

#### Option A: Start Both Services (Recommended)
```bash
# From root directory
npm run dev
```

#### Option B: Start Services Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Session Endpoints

#### GET /api/sessions
Get all published sessions (public).

**Response:**
```json
{
  "message": "Published sessions retrieved successfully",
  "sessions": [
    {
      "_id": "session_id",
      "title": "Morning Yoga Flow",
      "tags": ["yoga", "morning", "beginner"],
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "userId": {
        "email": "user@example.com"
      }
    }
  ]
}
```

#### GET /api/sessions/my-sessions
Get user's own sessions (drafts + published).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /api/sessions/my-sessions/:id
Get a specific user session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /api/sessions/my-sessions/save-draft
Save or update a draft session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Session Title",
  "tags": ["tag1", "tag2"],
  "jsonFileUrl": "https://example.com/session.json",
  "sessionId": "optional_existing_session_id"
}
```

#### POST /api/sessions/my-sessions/publish
Publish a session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "sessionId": "session_id_to_publish"
}
```

#### GET /api/sessions/:id/can-edit
Check if user can edit a specific session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "You can edit this session",
  "canEdit": true,
  "session": {
    "id": "session_id",
    "title": "Session Title",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String (required),
  tags: [String],
  jsonFileUrl: String (required),
  status: String (enum: ['draft', 'published']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Key Features Explained

### Auto-Save Functionality
- **Debounced Auto-Save**: Sessions auto-save after 5 seconds of inactivity
- **Visual Feedback**: Real-time status indicators show save state
- **Draft Management**: Seamless transition between draft and published states
- **Error Handling**: Graceful handling of auto-save failures

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Middleware protection for sensitive endpoints

### User Experience
- **Responsive Design**: Mobile-first approach with modern CSS
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Visual indicators during API calls
- **Error Handling**: Comprehensive error messages and recovery

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production
3. Deploy and note the backend URL

### Frontend Deployment (Netlify/Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL
5. Deploy

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string and update your environment variables

## 🧪 Testing the Application

### 1. Register a New User
- Navigate to http://localhost:3000/register
- Create an account with email and password
- You'll be automatically logged in

### 2. Create a Session
- Click "Create New Session" or navigate to /session-editor
- Fill in the session details
- Notice the auto-save functionality working
- Save as draft or publish

### 3. View Sessions
- Dashboard shows all published sessions
- My Sessions shows your drafts and published sessions
- Test editing and publishing workflows

## 🔧 Development

### Project Structure
```
arvyax-wellness-platform/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── App.js       # Main app component
│   └── public/          # Static assets
├── docker-compose.yml   # MongoDB container
└── README.md           # This file
```

### Available Scripts
```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure Docker is running
- Check if MongoDB container is up: `docker ps`
- Restart container: `docker-compose restart mongodb`

**Frontend Not Loading**
- Check if backend is running on port 5000
- Verify proxy configuration in package.json
- Clear browser cache and restart

**Authentication Issues**
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in Authorization header
- Clear localStorage and try logging in again

**Auto-save Not Working**
- Check browser console for errors
- Verify backend is responding to save-draft endpoint
- Ensure form has required fields filled

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check browser console and network tabs
4. Verify all environment variables are set correctly

---

**Built with ❤️ for Arvyax Wellness Platform**
