# Kalpla

A modern full-stack application built with Next.js frontend and Node.js backend.

## 🚀 Features

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Development**: Hot reload for both frontend and backend
- **Modern UI**: Beautiful, responsive design with dark mode support

## 📁 Project Structure

```
kalpla/
├── kalpla-frontend/     # Next.js frontend application
├── kalpla-backend/      # Node.js backend API
├── package.json         # Root package.json with scripts
└── README.md           # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Individual Commands

You can also run the frontend and backend separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production

Build and start the application for production:

```bash
npm run build
npm run start
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend
- `npm run build` - Build both applications for production
- `npm run start` - Start both applications in production mode
- `npm run install:all` - Install dependencies for all projects

## 🌐 API Endpoints

The backend provides the following endpoints:

- `GET /` - Welcome message
- `GET /api/health` - Health check with uptime
- `GET /api/kalpla` - Kalpla-specific information

## 🎨 Frontend Features

- Real-time API status monitoring
- Responsive design with Tailwind CSS
- Dark mode support
- Modern UI components
- TypeScript for type safety

## 🔧 Backend Features

- Express.js server with TypeScript
- CORS enabled for frontend communication
- Health check endpoints
- Environment variable support
- Hot reload with nodemon

## 📝 Development Notes

- The frontend automatically connects to the backend API
- Both applications support hot reload during development
- TypeScript is configured for both frontend and backend
- Tailwind CSS is used for styling

## 🚀 Deployment

For deployment, you can:

1. Build both applications: `npm run build`
2. Deploy the frontend to Vercel, Netlify, or similar
3. Deploy the backend to Heroku, Railway, or similar cloud providers

Make sure to update the API URLs in the frontend for production deployment.
