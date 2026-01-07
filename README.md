# Title
Vephla Productivity-suite

## Description
The **Vephla Productivity Suite** is a full-stack backend application designed to demonstrate advanced backend engineering concepts using Node.js, Express.js and MongoDB.

The system provides secure authentication, role-based access control, CRUD-based productivity modules (Notes, Tasks, and Files), real-time communication via Socket.io, and optional GraphQL integration.  
It simulates a production-ready backend suitable for modern SaaS productivity platforms.

This project serves as a **capstone demonstration** of backend architecture, API design, security, real-time systems, and deployment best practices.


## Key Features
- JWT-based Authentication & Authorization
- Role-Based Access Control (RBAC)
  - Admin
  - Standard User
- CRUD Operations
  - Notes Management
  - Tasks Management
  - File Uploads (Profile images / attachments)
- Real-Time Communication
  - Chat system
  - Notifications (Socket.io)
- RESTful API Architecture
- Optional GraphQL API (`/graphql`)
- Secure File Handling (Multer / Cloudinary)
- MongoDB Persistent Storage
- Production-Level Security
  - Helmet
  - Rate Limiting
  - Mongo Sanitize
  - XSS Protection
- API Documentation (Postman / Swagger)
- Cloud Deployment (Render / Railway)


## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT (Authentication)**
- **Bcrypt.js** (Password Hashing)
- **Socket.io** (Real-time communication)
- **Cloudinary** (File uploads)
- **GraphQL & express-graphql** (Bonus)
- **dotenv** (Environment variables)
- **Helmet, Express-rate-limit, Mongo-sanitize, XSS-clean** (Security)



## Project Structure

vephla-productivity-suite/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   └── utils/
│
├── docs/
│   ├── erd/
│   ├── diagrams/
│   └── postman/
│
├── .env.example
├── .gitignore
├── server.js
├── README.md
└── package.json


## Installation & Setup
'''bash
git clone https://github.com/Don-pizu/vephla-productivity-suite.git

# Navigate into the project folder
cd vephla-productivity-suite

# Install dependencies
npm install

# Start the server
node server.js

## Environment Configuration
Create a .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d


## API Endpoints

## Auth Routes
| Method | Endpoint                    | Description            | Access  |
| ------ | --------------------------- | ---------------------- | ------- |
| POST   | `/api/auth/register`        | Register new user      | Public  |
| POST   | `/api/auth/login`           | Login user             | Public  |
| GET    | `/api/auth/me`              | Get authenticated user | Private |
| GET    | `/api/auth/users`           | Get all users          | Admin   |
| PUT    | `/api/auth/update-role/:id` | Update user role       | Admin   |


## Real-Time Communication (Socket.io)

- User connection & disconnection

- Chat room messaging

- Notification events on task/note creation


## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

```bash

git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/vephla-productivity-suite.git
git push -u origin main

