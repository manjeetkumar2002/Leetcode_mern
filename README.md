# LeetCode MERN Project

A full-stack coding platform inspired by LeetCode, built with the MERN stack. The project includes user authentication, a problem dashboard, coding challenge pages, admin management, AI-powered doubt solving, and video-based explanations.

## Features

- User signup/login with secure authentication
- Problem listing with difficulty and tag filters
- Problem detail page with code editor and submission flow
- Solved status tracking for each user
- Admin dashboard to create, update, and delete coding problems
- Video solution support for problem explanations
- AI-powered chat support for coding doubts
- MongoDB + Redis integration for app data and caching
- Code execution support through external judge services

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- JWT-based authentication
- Cloudinary for media uploads
- Google Gemini AI for intelligent support

## Project Structure

```bash
LEETCODE/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── README-GITHUB.md
└── readme.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd LEETCODE
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the required environment variables, for example:

```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_connection_string
REDIS_PASS=your_redis_password
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open the frontend in your browser, usually at:

```bash
http://localhost:5173
```

## Admin Access

The project includes an admin role for managing problems and content. Admin users can:

- Create new problems
- Update existing problems
- Delete problems
- Manage uploaded solution videos

## Contribution

Contributions are welcome. If you want to improve the platform:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is for educational and personal learning purposes.

## Notes

This file is intended as a GitHub-friendly project overview and is kept separate from the existing repository README so the original project documentation remains untouched.
