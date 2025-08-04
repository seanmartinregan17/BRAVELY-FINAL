# Bravely - Exposure Therapy Tracker

A comprehensive exposure therapy tracking application with GPS integration, built with React and Express.

## Project Structure

```
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Client dependencies
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   └── package.json        # Server dependencies
├── capacitor.config.ts     # Capacitor mobile app config
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

### Development

Start both client and server in development mode:
```bash
npm run dev
```

Or start them individually:
```bash
# Start client only (http://localhost:5173)
npm run dev:client

# Start server only (http://localhost:3000)
npm run dev:server
```

### Building

Build both client and server:
```bash
npm run build
```

## Deployment

### Frontend (Vercel)

The client is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set the build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm run install:all`

### Backend (Railway)

The server is configured for deployment on Railway:

1. Connect your repository to Railway
2. Set the root directory to `server`
3. Railway will automatically detect the Node.js project

### Environment Variables

#### Client (.env)
```
VITE_API_URL=http://localhost:3000/api  # Development
VITE_API_URL=https://your-api-domain.railway.app/api  # Production
```

#### Server (.env)
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Mobile App (Capacitor)

The project includes Capacitor configuration for mobile app development:

```bash
# Add platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build:client
npx cap sync

# Open in IDE
npx cap open ios
npx cap open android
```

## Features

- 📱 Progressive Web App (PWA)
- 🗺️ GPS tracking for exposure therapy sessions
- 📊 Progress tracking and analytics
- 🎯 Goal setting and achievement system
- 💡 CBT tools and resources
- 🔐 User authentication and profiles
- 📱 Mobile app support (iOS/Android)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Wouter (routing)

### Backend
- Node.js
- Express
- TypeScript
- CORS enabled

### Mobile
- Capacitor
- iOS/Android support

## Scripts

- `npm run dev` - Start both client and server
- `npm run build` - Build both projects
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean node_modules and dist folders