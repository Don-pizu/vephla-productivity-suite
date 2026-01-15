# Title
Vephla Productivity-suite

## Description
Vephla Productivity Suite is a production-grade backend system built with Node.js, Express.js, and MongoDB, designed to simulate the core backend architecture of a modern SaaS productivity platform.

The application demonstrates secure authentication workflows, role-based access control, modular CRUD systems, real-time communication, file handling, API documentation, and optional GraphQL integration.

This project serves as a capstone backend engineering project, emphasizing scalability, security, maintainability, and clean architectural patterns.

## Key Features
- JWT-based Authentication & Authorization
- Email OTP verification flow
- Password reset via email token
- Role-Based Access Control (RBAC)
  - Admin
  - Standard User
- Secure password hashing (bcrypt)
- HTTP security headers (Helmet)
- Rate limiting & input sanitization
- XSS and NoSQL injection protection
  
## Productivity Modules
# Notes
- Create, update, delete notes
- File attachments (images/documents)
- Tag-based filtering
- Admin access to all notes

# Tasks
- Task assignment by email
- Status updates
- Due dates
- Attachments
- Admin oversight

# Files
- Profile image uploads
- Attachments via Cloudinary

# Real-Time Features
- Socket.io-powered chat system
- Room-based messaging
- File uploads in chat
- Real-time notifications

# API Architecture
- RESTful API (primary)
- Optional GraphQL API (/graphql)
- Swagger API Documentation
- Postman collections

# Deployment Ready
- Environment-based configuration
- Cloud-ready (Render)
- Redis-supported session handling (optional)

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
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=

RESEND_API_KEY=
FROM_EMAIL=

REDIS_HOST=
REDIS_PORT=
REDIS_PASS=
REDIS_URL=

## API Documentation
# Swagger UI
  http://localhost:5000/api-docs


## API Endpoints

## Auth Routes
| Method | Endpoint                          | Access |
| ------ | --------------------------------- | ------ |
| POST   | `/api/auth/register`              | Public |
| POST   | `/api/auth/verifyOtp`             | Public |
| POST   | `/api/auth/resendOtp`             | Public |
| POST   | `/api/auth/login`                 | Public |
| POST   | `/api/auth/forgotPassword`        | Public |
| POST   | `/api/auth/reset-password/:token` | Public |
| GET    | `/api/auth/me`                    | User   |
| PUT    | `/api/auth/update`                | User   |
| GET    | `/api/auth/allusers`              | Admin  |
| GET    | `/api/auth/user/:id`              | Admin  |

## Notes Routes
| Method | Endpoint         | Access      |
| ------ | ---------------- | ----------- |
| POST   | `/api/notes`     | User        |
| GET    | `/api/notes`     | User        |
| GET    | `/api/notes/:id` | User        |
| PUT    | `/api/notes/:id` | Owner/Admin |
| DELETE | `/api/notes/:id` | Owner/Admin |
| GET    | `/api/allNotes`  | Admin       |

## Task Routes
| Method | Endpoint         | Access         |
| ------ | ---------------- | -------------- |
| POST   | `/api/task`      | User           |
| GET    | `/api/tasks`     | User           |
| GET    | `/api/tasks/:id` | User           |
| PUT    | `/api/tasks/:id` | Assigned/Admin |
| PUT    | `/api/task/:id`  | Owner/Admin    |
| DELETE | `/api/tasks/:id` | Owner/Admin    |
| GET    | `/api/allTasks`  | Admin          |

## chat 
| Method | Endpoint                | Access |
| ------ | ----------------------- | ------ |
| GET    | `/api/messages/:roomId` | User   |
| POST   | `/api/messages/upload`  | User   |


## GraphQL API
  POST /graphql




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

