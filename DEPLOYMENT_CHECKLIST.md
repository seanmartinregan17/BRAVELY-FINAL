# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📋 Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All dependencies are properly listed in package.json files
- [ ] Local development works (`npm run dev`)
- [ ] Local build works (`npm run build`)
- [ ] You have accounts on Vercel and Railway

## 🚂 Railway (Backend) Deployment

- [ ] Create new Railway project from GitHub repo
- [ ] Set root directory to `server`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `CORS_ORIGIN=https://your-app-name.vercel.app` (update later)
- [ ] Wait for deployment to complete
- [ ] Test backend endpoints:
  - [ ] `https://your-project.railway.app/` (root)
  - [ ] `https://your-project.railway.app/api/health` (health check)
- [ ] Copy Railway URL for next step

## ⚡ Vercel (Frontend) Deployment

- [ ] Create new Vercel project from GitHub repo
- [ ] Configure build settings:
  - [ ] Framework: Vite
  - [ ] Root directory: `client`
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=https://your-project.railway.app` (from Railway step)
  - [ ] `VITE_APP_NAME=Bravely`
  - [ ] `VITE_APP_VERSION=1.0.0`
- [ ] Deploy and wait for completion
- [ ] Copy Vercel URL

## 🔧 Final Configuration

- [ ] Update Railway `CORS_ORIGIN` with actual Vercel URL
- [ ] Wait for Railway to redeploy
- [ ] Test full stack connection:
  - [ ] Frontend loads without errors
  - [ ] API calls work (check browser console)
  - [ ] No CORS errors

## 🧪 Testing

- [ ] Frontend loads at Vercel URL
- [ ] Backend responds at Railway URL
- [ ] API health check works from frontend
- [ ] No console errors in browser
- [ ] Mobile responsive design works

## 🎯 Post-Deployment (Optional)

- [ ] Set up custom domains
- [ ] Configure monitoring/analytics
- [ ] Set up error tracking
- [ ] Configure CI/CD for automatic deployments
- [ ] Build mobile apps with Capacitor

## 🆘 If Something Goes Wrong

1. **Check logs:**
   - Railway: Dashboard → Deployments → View Logs
   - Vercel: Dashboard → Functions → View Logs

2. **Verify environment variables:**
   - Ensure all required variables are set
   - Check for typos in URLs

3. **Test API directly:**
   ```bash
   curl https://your-project.railway.app/api/health
   ```

4. **Common fixes:**
   - Redeploy both services after env var changes
   - Check CORS_ORIGIN matches Vercel domain exactly
   - Ensure Node.js version is 18+ on both platforms

## 📱 URLs to Save

After deployment, save these URLs:

- **Frontend (Vercel):** `https://your-app-name.vercel.app`
- **Backend (Railway):** `https://your-project-name.railway.app`
- **API Base:** `https://your-project-name.railway.app/api`

---

**Total estimated time:** 15-30 minutes for first deployment