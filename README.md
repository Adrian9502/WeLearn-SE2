# WeLearn - A Web Game Simulation Platform

## 🚀 Project Overview

WeLearn is an interactive web platform designed to help students and enthusiasts master sorting algorithms and binary operations through engaging quizzes. Developed as part of a Software Engineering 2 project, it leverages the MERN stack (MongoDB, Express.js, React.js, Node.js) and includes key features such as user progress tracking, a ranking system, and daily rewards.

### 🌟 Key Features

- Multiple quiz categories (Sorting Algorithms, Binary Operations)
- Difficulty levels (Easy, Medium, Hard)
- Comprehensive quiz management
- Total of 240 quizzes
- User Progress Tracking
- Quiz Completion Tracking
- Ranking System
- Daily Rewards System

# 🌟 Website Overview

# USER
![Overview](pictures/overview.png)
![Overview](pictures/overview-1.png)
![Overview](pictures/overview-2.png)

# ADMIN
![Admin Overview](pictures/image_2024-12-11_211426441.png)
![Admin Overview](pictures/image_2024-12-11_211528767.png)
![Admin Overview](pictures/image_2024-12-11_211546093.png)
![Admin Overview](pictures/image_2024-12-11_211557471.png)

## LIVE LINK 🚀
- [welearngame](https://welearngame.vercel.app)

### ACCESS ADMIN DASHBOARD at https://welearngame.vercel.app/admin (for production) or http://localhost:5173/admin (for development)
- Username: admin123
- Password: Admin123!@#

### ACCESS USER DASHBOARD
- Username: johnDoe123
- Password: johnDoe123@

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 🛠 Tools used for Testing
- **Jest**:

## 📦 Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB (v4.4 or later)
- npm (v6.0.0 or later)

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

## 🔧 Installation

### Clone the Repository

```bash
git clone https://github.com/Adrian9502/WeLearn-SE2
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
2. Add the following environment variables
Copy and paste the code below into the .env file and replace the placeholder values (<...>) with your actual configuration details:

```
CLOUDINARY_API_SECRET = <replace with cloudinary api key>
MONGODB_URI = <replace with mongodb uri>
JWT_SECRET = <replace with your secured jwt secret key>
API_BASE_URL = https://welearn-api.vercel.app
PUBLIC_URL = https://welearn-api.vercel.app
CLOUDINARY_CLOUD_NAME = <replace with your cloudinary cloud name>
CLOUDINARY_API_KEY = <replace with your cloudinary api key>
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
npm run dev
```

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

![Alt Text](image_2024-12-17_213443971.png)

- John Adrian B. Bonto - Full Stack Developer
- Derwin P. Elsenique - Research Paper Scientist
- Ruis A. Lirag - Research Paper Scientist
- Jhade B. Piamonte - Research Analyst

Project Link: [https://github.com/Adrian9502/WeLearn-SE2](https://github.com/Adrian9502/WeLearn-SE2)
Live Link: [https://welearn.vercel.app/](https://welearn.vercel.app/)

Big credit to [Pixels](https://www.pixels.xyz) for our inspired login UI!
