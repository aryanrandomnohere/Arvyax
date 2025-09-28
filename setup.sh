#!/bin/bash

echo "🧘 Setting up Arvyax Wellness Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
PORT=4000
MONGODB_URI=mongodb://admin:password123@localhost:27017/arvyax_wellness?authSource=admin
JWT_SECRET=arvyax_super_secret_jwt_key_2024_wellness_platform
NODE_ENV=development
EOF
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Start MongoDB with Docker
echo "🐳 Starting MongoDB with Docker..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

# Check if MongoDB is running
if docker ps | grep -q "arvyax-mongodb"; then
    echo "✅ MongoDB is running"
else
    echo "❌ Failed to start MongoDB. Please check Docker is running."
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Or start services separately:"
echo "  Backend:  npm run server"
echo "  Frontend: npm run client"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo ""
echo "Happy coding! 🚀"
