# Task Manager with Authentication

A full-stack task management web app where users can sign up, log in, and manage their own personal tasks.

## Features
- User signup and login with JWT-based authentication
- Passwords securely hashed with bcrypt
- Add, complete/uncomplete, and delete tasks
- Each user only sees their own tasks
- Filter tasks by All / Pending / Completed

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken), bcryptjs for password hashing

## How to Run
1. Clone this repository
2. Run `npm install` to install dependencies
3. Replace the `MONGO_URI` value in `server.js` with your own MongoDB connection string
4. Run `node server.js`
5. Open `http://localhost:3000` in your browser

## Project Structure
- `server.js` - Express server, API routes, MongoDB models
- `public/index.html` - Frontend (signup/login + task dashboard)

## Author
Anshu Priya - Full Stack Developer Trainee
