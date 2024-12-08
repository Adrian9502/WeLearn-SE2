# WeLearn - A Web Game Simulation Platform

## 🚀 Project Overview

This MERN stack application is an interactive quiz platform designed to help students and enthusiasts learn and practice sorting algorithms and binary operations through engaging, structured quizzes.

### 🌟 Key Features

- Multiple quiz categories (Sorting Algorithms, Binary Operations)
- Difficulty levels (Easy, Medium, Hard)
- Automatic quiz ID generation
- Comprehensive quiz management
- Total of 240 quizzes
- User Progress Tracking
- Quiz Completion Tracking
- Ranking System
- Daily Rewards System

### ACCESS ADMIN DASHBOARD at /admin

- Username: admin123
- Password: Admin123!@#

### ACCESS USER DASHBOARD

- Username: johnDoe123
- Password: johnDoe123@

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **ODM**: Mongoose

## 🛠 Tools used for Testing

- **Postman**: Jest

## 📦 Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB (v4.4 or later)
- npm (v6.0.0 or later)

## 🔧 Installation

### Clone the Repository

```bash
git clone git@github.com:Adrian9502/WeLearn-SE2.git
cd WeLearn-SE2
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🗃 Database Configuration

1. Create a `.env` file in the backend directory
2. Add your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

### Start Frontend Development Server

```bash
cd frontend
npm start
```

## 🌈 Available Quiz Categories

### Sorting Algorithms

- Bubble Sort
- Insertion Sort
- Merge Sort
- Selection Sort

### Binary Operations

- Addition
- Subtraction
- Alphabet Conversions

## 🏆 Difficulty Levels

- Easy
- Medium
- Hard

## 📝 Database Schema

### Quiz Model

- `quizId`: Unique identifier (auto-generated)
- `title`: Quiz title
- `instructions`: Quiz instructions
- `questions`: Quiz questions
- `answer`: Correct answer
- `type`: Quiz type (Sorting/Binary Operation)
- `category`: Specific category
- `difficulty`: Skill level

## 🧪 Seeding Data

Run the seeding script to populate your database with initial quizzes:

```bash
cd backend
node scripts/seedQuizzes.js
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- bontojohnadrian@gmail.com

## Our Team

- John Adrian B. Bonto - Full Stack Developer
- Derwin P. Elsenique - Research Paper Scientist
- Ruis A. Lirag - Research Paper Scientist
- Jhade B. Piamonte - Research Analyst

Project Link: [https://github.com/Adrian9502/WeLearn-SE2](https://github.com/Adrian9502/WeLearn-SE2)
Live Link: [https://welearn.vercel.app/](https://welearn.vercel.app/)
