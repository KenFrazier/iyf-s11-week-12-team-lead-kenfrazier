# Week 12: CommunityHub - Final Project

## Author
- Name: Frazier Kennedy
- GitHub: KenFrazier (https://github.com/KenFrazier)
- Date: August 20, 2026

## Project Description
CommunityHub is a full-stack web application that helps communities report and track local issues, such as broken pipes, unsafe roads, or missing streetlights. Citizens report problems, elders and admins acknowledge them, specialists mark them as in progress, and everyone can follow an issue through its full lifecycle: reported to acknowledged to pending to resolved.

The project was built by a three-person team, with each member owning a core feature area.

## Technologies Used
- React frontend, via Vite
- Node.js and Express backend REST API
- MongoDB and Mongoose database
- JWT and bcryptjs for authentication and password hashing
- Git and GitHub for version control and PR-based team workflow

## Features
- User registration and login with hashed passwords
- JWT-based authentication with protected routes
- Role-based authorization for citizen, elder, admin, and specialist
- Report, view, and track issues through a status lifecycle
- Comment and status-update system on individual issues
- Admin-only dashboard with live issue and user statistics
- Admins can see which comments came from specialists
- Responsive UI with a navigation bar and login flow

## How to Run
1. Clone this repository,(git clone https://github.com/KenFrazier/iyf-s11-week-12-team-lead-kenfrazier.git
cd iyf-s11-week-12-team-lead-kenfrazier), and enter the folder
2. Install backend dependencies inside the backend folder and create a .env file there
3. Install frontend dependencies inside the frontend folder and create a .env file there
4. Run the backend in one terminal by entering backend and running node server.js
5. Run the frontend in a second terminal by entering frontend and running npm run dev
6. Open the printed local URL, usually http colon slash slash localhost 5173, in your browser

## Lessons Learned
- How JSON Web Tokens work, including header, payload, and signature, and why passwords must never be stored in plain text
- How to structure a real Express backend with routes, controllers, middleware, and models
- How Mongoose relationships connect data across collections using populate
- How to set up and manage a team GitHub workflow with branch protection and required PR reviews

## Challenges Faced
- A Mongoose version upgrade changed how the pre-save middleware handles callbacks, causing an error that took careful debugging to trace back to the model file
- MongoDB's connection string failed to resolve on certain networks due to DNS issues, so a direct connection string was used as a workaround
- Coordinating a team where two original members became unavailable, requiring onboarding two new teammates mid-project

## Live Demo
**Frontend:** [https://communityhub-alpha-cyan.vercel.app](https://communityhub-alpha-cyan.vercel.app)  
**Backend API:** [https://communityhub-api-h7n6.onrender.com/api](https://communityhub-api-h7n6.onrender.com/api)

## Deployment Guide

### Backend Deployment (Render)

1. **Prepare Repository**
   - Ensure `.gitignore` includes: `node_modules/`, `.env`, `dist/`
   - Push all changes to GitHub

2. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** community-hub-api
     - **Branch:** main
     - **Root Directory:** backend
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

4. **Add Environment Variables**
   - In Render Dashboard, add:
     - `NODE_ENV=production`
     - `MONGODB_URI=<your-mongodb-uri>`
     - `JWT_SECRET=<your-secret-key>`
     - `FRONTEND_URL=<your-vercel-frontend-url>`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Test: `https://your-app.onrender.com/api/health`

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** dist

3. **Add Environment Variables**
   - Add `VITE_API_URL=https://your-api.onrender.com/api`

4. **Deploy**
   - Click "Deploy"
   - Wait for build
   - Visit your deployed site

### Health Check Setup

API includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2026-08-21T12:00:00Z",
  "uptime": 123.45,
  "database": "connected"
}
```

### Deployment Checklist

- [ ] All CRUD operations work locally
- [ ] Authentication flow complete
- [ ] Protected routes configured
- [ ] Error messages are user-friendly
- [ ] Loading states visible
- [ ] Responsive design verified
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] API URLs updated in frontend
- [ ] README updated with live links
- [ ] Team contributions documented in CONTRIBUTORS.md
