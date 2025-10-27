# 🚀 Deployment Guide

This guide will walk you through deploying the Bravely app to Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account
- [Railway](https://railway.app) account
- Your code pushed to a GitHub repository

## 🎯 Deployment Overview

1. **Backend (Server)** → Railway
2. **Frontend (Client)** → Vercel
3. **Configure Environment Variables**
4. **Test the Connection**

---

## 🚂 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect it's a Node.js project

### 1.2 Configure Railway Settings

1. In your Railway dashboard, click on your project
2. Go to **Settings** → **Environment**
3. Add these environment variables:

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-app-name.vercel.app
```

> **Note**: Replace `your-app-name` with your actual Vercel domain (you'll get this in step 2)

### 1.3 Set Root Directory

1. In Railway dashboard, go to **Settings** → **Service**
2. Set **Root Directory** to: `server`
3. Railway will automatically use the `package.json` in the server folder

### 1.4 Deploy

1. Railway will automatically deploy your backend
2. Once deployed, you'll get a URL like: `https://your-project-name.railway.app`
3. **Save this URL** - you'll need it for the frontend

### 1.5 Test Backend

Visit your Railway URL to test:
- `https://your-project-name.railway.app/` - Should show API info
- `https://your-project-name.railway.app/api/health` - Should show health status

---

## ⚡ Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project

### 2.2 Configure Build Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 2.3 Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://your-project-name.railway.app
VITE_APP_NAME=Bravely
VITE_APP_VERSION=1.0.0
```

> **Replace** `your-project-name.railway.app` with your actual Railway URL from Step 1

### 2.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://your-app-name.vercel.app`

---

## 🔧 Step 3: Update CORS Configuration

### 3.1 Update Railway Environment

Go back to Railway and update the `CORS_ORIGIN` variable:

```env
CORS_ORIGIN=https://your-app-name.vercel.app
```

> **Replace** with your actual Vercel domain

### 3.2 Redeploy Railway

Railway will automatically redeploy with the new environment variable.

---

## ✅ Step 4: Test the Full Stack

### 4.1 Test API Connection

1. Open your Vercel app: `https://your-app-name.vercel.app`
2. Open browser developer tools (F12)
3. Check the console for API health check logs
4. You should see: `API Health Check: {status: "ok", ...}`

### 4.2 Test CORS

Try making API calls from your frontend. If you see CORS errors, double-check:
- Railway `CORS_ORIGIN` matches your Vercel domain exactly
- Both deployments are using the latest code

---

## 🎯 Quick Setup Commands

If you want to test locally first:

```bash
# Install all dependencies
npm run install:all

# Start both client and server
npm run dev

# Build both projects
npm run build
```

---

## 🌐 Custom Domains (Optional)

### For Vercel (Frontend)
1. Go to Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### For Railway (Backend)
1. Go to Railway dashboard → **Settings** → **Networking**
2. Add your custom domain
3. Update the `CORS_ORIGIN` environment variable to match

---

## 🔍 Troubleshooting

### Common Issues

**1. CORS Errors**
- Check that `CORS_ORIGIN` in Railway matches your Vercel domain exactly
- Ensure both services are deployed with latest code

**2. API Not Found (404)**
- Verify the `VITE_API_URL` in Vercel environment variables
- Check that Railway backend is running at the correct URL

**3. Build Failures**
- Check that Node.js version is 18+ on both platforms
- Verify all dependencies are correctly listed in package.json files

**4. Environment Variables Not Working**
- In Vercel: Environment variables must start with `VITE_`
- In Railway: Redeploy after changing environment variables

### Debug Steps

1. **Check Railway Logs**:
   - Go to Railway dashboard → **Deployments** → **View Logs**

2. **Check Vercel Logs**:
   - Go to Vercel dashboard → **Functions** → **View Function Logs**

3. **Test API Directly**:
   ```bash
   curl https://your-project-name.railway.app/api/health
   ```

4. **Check Network Tab**:
   - Open browser dev tools → **Network** tab
   - Look for failed API requests

---

## 📱 Mobile App Deployment (Bonus)

After web deployment, you can also build mobile apps:

```bash
# Build the web app first
cd client && npm run build

# Sync with Capacitor
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

---

## 🎉 You're Done!

Your Bravely app should now be fully deployed:
- ✅ Frontend on Vercel
- ✅ Backend on Railway  
- ✅ CORS configured
- ✅ Environment variables set
- ✅ Ready for users!

**Your app URLs:**
- Frontend: `https://your-app-name.vercel.app`
- Backend API: `https://your-project-name.railway.app`

---

## 🆘 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Review the deployment logs on both platforms
3. Ensure all environment variables are correctly set
4. Verify your domains match exactly in CORS configuration