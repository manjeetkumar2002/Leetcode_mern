# 📚 LeetCode Clone - Full Stack Coding Platform

A full-featured coding platform with admin dashboard, video solutions, AI assistance, and user progress tracking.

## ✨ Features

### 👑 Admin Panel
- Create, update, delete coding problems
- Manage visible & hidden test cases
- Upload video solutions via Cloudinary
- Verify reference solutions automatically
- User role management

### 💻 Code Execution
- Multi-language support (C++, Java, JavaScript)
- Run code against test cases
- Real-time submission with detailed feedback
- Judge0 API integration
- Runtime & memory analysis

### 📊 User Features
- **Submission History**: View all past submissions with status, runtime, and memory
- **Solved Problems**: Track problems you've successfully solved
- **Problem Status**: Visual badges showing solved/attempted/new
- **Profile Analytics**: View your progress statistics

### 📹 Video Solutions
- Cloudinary-powered uploads
- Automatic thumbnail generation
- Stream video solutions

### 🤖 AI Assistant
- Powered by Google Gemini API
- Get hints without revealing solutions
- Code review and debugging help
- Complexity analysis
- Edge case suggestions

### 🔐 Security
- JWT authentication with HTTP-only cookies
- Role-based access (User/Admin)
- Redis token blacklisting for secure logout
- Bcrypt password hashing

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis
- **Cloud Services**: Cloudinary, Judge0
- **AI**: Google Gemini API
- **Auth**: JWT, Bcrypt

## 📁 Folder Structure
├── config/ # DB & Redis connections
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Auth & authorization
├── controllers/ # Business logic
├── utils/ # Helper functions
└── .env # Environment variables



## 🚀 Quick Start

### Prerequisites
- Node.js
- MongoDB
- Redis
- Cloudinary Account
- Judge0 API Key
- Gemini API Key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/leetcode-clone.git
cd leetcode-clone

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start servers
mongod          # MongoDB
redis-server    # Redis

# Run app
npm run dev     # Development
npm start       # Production

### Environment Variables

PORT=5000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET_KEY=your_api_secret
JUDGE0_API=your_judge0_key
GEMINI_API_KEY=your_gemini_key