# Bravely - Exposure Therapy Tracker

A Progressive Web App (PWA) designed to help users track their exposure therapy sessions with GPS location tracking and build confidence step by step.

## Features

- 📱 Progressive Web App (PWA) with offline support
- 🗺️ GPS-based session tracking
- 📊 Progress visualization and analytics
- 🎯 Goal setting and achievement tracking
- 🧠 CBT (Cognitive Behavioral Therapy) tools
- 📝 Session reflection and journaling
- 🔔 Smart notifications and reminders
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **Mobile**: Capacitor (for native mobile apps)
- **Backend**: Express.js (serverless functions)

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── src/                    # Source files
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── server/               # Backend API routes
├── public/               # Static assets
├── capacitor.config.ts   # Capacitor configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Key Components

### Authentication
- User registration and login
- Session management with localStorage
- Subscription status tracking

### Session Tracking
- GPS-based location tracking
- Real-time session monitoring
- Anxiety level tracking
- Session reflection and notes

### Progress Analytics
- Session history and statistics
- Progress visualization with charts
- Achievement system
- Weekly progress summaries

### CBT Tools
- Breathing exercises
- Exposure hierarchy management
- Cognitive restructuring tools
- Emergency comfort tools

## Mobile App Development

This project is configured with Capacitor for building native mobile apps:

### iOS Development
```bash
npx cap add ios
npx cap run ios
```

### Android Development
```bash
npx cap add android
npx cap run android
```

## Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.