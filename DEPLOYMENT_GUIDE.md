# Bravely App Deployment Guide

This guide walks you through deploying the Bravely exposure therapy tracking app with the frontend on Vercel and the backend on Railway.

## Project Structure

Your project is now organized as follows:
```
workspace/
├── frontend/          # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── hooks/
│   ├── public/        # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── vercel.json
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   ├── railway.json
│   └── .env.example
└── DEPLOYMENT_GUIDE.md
```

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Railway Account**: Sign up at [railway.app](https://railway.app)
4. **Google Maps API Key**: For location services
5. **Database**: Railway provides PostgreSQL
6. **Environment Variables**: Configured properly

## Part 1: Backend Deployment on Railway

### Step 1: Prepare Your Backend

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies** (optional, Railway will do this):
   ```bash
   npm install
   ```

3. **Test locally**:
   ```bash
   npm run dev
   ```

### Step 2: Deploy to Railway

1. **Visit Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"

2. **Connect GitHub Repository**:
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as the root directory

3. **Configure Build Settings**:
   - Railway should auto-detect your Node.js app
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Root Directory: `backend`

4. **Add Database**:
   - In your Railway project, click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL`

5. **Set Environment Variables**:
   In Railway dashboard, go to Variables tab and add:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

6. **Deploy**:
   - Railway will automatically deploy when you push to your main branch
   - Note your Railway app URL (e.g., `https://your-app.railway.app`)

### Step 3: Set Up Database (if using Prisma)

1. **Add Prisma schema** (create `backend/prisma/schema.prisma`):
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   // Add your data models here
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Your Frontend

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Update API endpoints**:
   Create `frontend/src/lib/config.ts`:
   ```typescript
   export const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-app.railway.app/api'
     : 'http://localhost:3001/api';
   ```

3. **Update your API calls**:
   Replace hardcoded API URLs with the config:
   ```typescript
   import { API_BASE_URL } from '@/lib/config';
   
   // Instead of: fetch('/api/sessions')
   // Use: fetch(`${API_BASE_URL}/sessions`)
   ```

4. **Test build locally**:
   ```bash
   npm install
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Visit Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"

2. **Import Repository**:
   - Connect your GitHub account
   - Select your repository
   - Choose the `frontend` folder as the root directory

3. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `frontend`

4. **Set Environment Variables**:
   In Vercel dashboard, go to Settings → Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-app.railway.app/api
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app
   - Note your Vercel app URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update CORS Settings

1. **Update backend CORS**:
   In your Railway backend, update the environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

2. **Redeploy backend** if needed.

## Part 3: Post-Deployment Configuration

### Step 1: Custom Domain (Optional)

**For Vercel (Frontend)**:
1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

**For Railway (Backend)**:
1. Go to Railway dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Step 2: Environment Variables Checklist

**Backend (.env)**:
- [ ] `PORT` (Railway sets this automatically)
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (Railway provides this)
- [ ] `JWT_SECRET` (generate a strong secret)
- [ ] `FRONTEND_URL` (your Vercel URL)
- [ ] `GOOGLE_MAPS_API_KEY`

**Frontend (Vercel Environment Variables)**:
- [ ] `VITE_API_BASE_URL` (your Railway API URL)
- [ ] `VITE_GOOGLE_MAPS_API_KEY`

### Step 3: SSL and Security

Both Vercel and Railway provide SSL certificates automatically. Ensure:
- [ ] All API calls use HTTPS
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Security headers are set (helmet.js in backend)

## Part 4: Continuous Deployment

### Automatic Deployments

Both platforms support automatic deployments:

1. **Push to main branch** → Both frontend and backend deploy automatically
2. **Pull requests** → Vercel creates preview deployments
3. **Environment branches** → Can be configured for staging

### Manual Deployments

**Vercel**:
```bash
npx vercel --prod
```

**Railway**:
```bash
railway login
railway deploy
```

## Part 5: Monitoring and Logs

### Vercel Monitoring
- Go to your project dashboard
- Check Functions tab for API logs
- Monitor performance in Analytics

### Railway Monitoring
- Go to your project dashboard
- Check Deployments for build logs
- Monitor metrics in the Metrics tab
- View application logs in real-time

## Part 6: Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `FRONTEND_URL` in backend matches your Vercel URL
   - Check browser network tab for exact error

2. **Build Failures**:
   - Check build logs in respective platforms
   - Verify all dependencies are in `package.json`
   - Ensure TypeScript types are correct

3. **Environment Variables**:
   - Verify all required variables are set
   - Remember to redeploy after changing variables
   - Use `VITE_` prefix for frontend variables

4. **Database Connection**:
   - Verify `DATABASE_URL` is correctly set
   - Check Railway database status
   - Ensure Prisma migrations are run

5. **Mobile App (Capacitor)**:
   - Update `capacitor.config.ts` with production URLs
   - Rebuild mobile apps after deployment

### Useful Commands

```bash
# Check deployment status
vercel ls
railway status

# View logs
vercel logs
railway logs

# Environment variables
vercel env ls
railway variables
```

## Part 7: Next Steps

After successful deployment:

1. **Set up monitoring** (Sentry, LogRocket, etc.)
2. **Configure analytics** (Google Analytics, Mixpanel, etc.)
3. **Set up backup strategies** for your database
4. **Implement CI/CD pipelines** for testing
5. **Configure staging environments**
6. **Set up health checks and alerts**

## Support

If you encounter issues:
- Check the platform-specific documentation
- Review deployment logs carefully
- Verify all environment variables
- Test API endpoints individually
- Check CORS and network connectivity

Good luck with your deployment! 🚀