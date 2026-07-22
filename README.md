#  InkSphere

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br/>

> **InkSphere** is a modern, high-performance blogging platform built on the MERN stack. It features real-time interactions, a robust authentication system, an intuitive admin dashboard, and advanced security configurations.

##  Key Features

- **Robust Authentication:** Secure email/password login, OTP verification, and password recovery.
- **Real-Time Capabilities:** Live notifications and active user updates powered by **Socket.IO**.
- **Advanced Security:** Implemented rate limiting, data sanitization (NoSQL injection prevention), XSS filtering, and HTTP header protection via Helmet.
- **Content Management:** Comprehensive CRUD operations for blog posts, rich text integration, and media handling.
- **Admin Dashboard:** Centralized management for users, blogs, and platform queries.
- **Responsive UI:** A beautiful, fully responsive frontend engineered with React, Vite, and Tailwind CSS.
- **Optimized Performance:** Manual chunking in Vite for faster load times and an optimized API structure.

---

##  Architecture & Tech Stack

### Frontend (`/client`)
- **Framework:** React.js (Bootstrapped with Vite)
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Networking:** Axios, Socket.IO Client
- **Icons & Graphics:** Lucide React, React Icons

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-Time Comm:** Socket.IO
- **Security:** Helmet, Express-Mongo-Sanitize, XSS, HPP, Express-Rate-Limit

---

##  Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd inksphere
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following template (do not use real values here):
```env
PORT=<YOUR_PORT>
MONGO_URL=<YOUR_MONGODB_CONNECTION_STRING>
JWT_SECRET=<YOUR_JWT_SECRET>
CLIENT_URL=<YOUR_FRONTEND_URL>
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory and add the required variables:
```env
VITE_API_URL=<YOUR_BACKEND_API_URL>
```
Start the frontend development server:
```bash
npm run dev
```

---

##  Deployment (Vercel)

The project is fully configured for deployment on **Vercel**.

1. **Backend Deployment:**
   - Create a new Vercel project and select the `server` directory.
   - Configure the environment variables in the Vercel dashboard.
   - Deploy.

2. **Frontend Deployment:**
   - Create a new Vercel project and select the `client` directory.
   - Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.
   - Deploy.

---

##  Folder Structure

```text
inkSphere/
├── client/                 # Frontend React Application
│   ├── src/                # React Source Code
│   ├── public/             # Static Assets
│   ├── .env.production     # Production Environment Variables
│   ├── vite.config.js      # Vite Configuration
│   └── package.json        
└── server/                 # Backend Node/Express Application
    ├── config/             # Database & Environment Configs
    ├── controllers/        # Route Handlers / Business Logic
    ├── middleware/         # Custom Express Middlewares
    ├── models/             # Mongoose Schemas
    ├── routes/             # API Endpoints
    ├── app.js              # Express App Configuration
    ├── server.js           # Server Entry Point & Socket.IO Setup
    ├── vercel.json         # Vercel Deployment Configuration
    └── package.json        
```

---

<div align="center">
  <i>Developed by Mr.Taha.</i>
</div>
