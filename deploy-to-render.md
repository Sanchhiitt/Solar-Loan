# Quick Render Deployment Guide

## 🚀 5-Minute Deployment

### Prerequisites
- GitHub account with your code pushed
- Render account (free signup at render.com)
- Gemini API key

### Step 1: Connect to Render
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click "New" → "Blueprint"
4. Select your `solar-loan-fit-checker` repository
5. Render will detect the `render.yaml` file automatically

### Step 2: Set Environment Variables
1. After deployment starts, go to the backend service
2. Click "Environment" tab
3. Add: `GEMINI_API_KEY` = `your_actual_api_key_here`
4. Click "Save Changes"

### Step 3: Wait and Test
1. Wait 5-10 minutes for deployment to complete
2. Both services will show "Live" status when ready
3. Click on frontend service URL to test your app

## 🔧 Manual Deployment (Alternative)

If blueprint doesn't work, create services manually:

### Backend Service
- **Name**: `solar-loan-backend`
- **Build Command**: `cd backend && pip install -r requirements.txt`
- **Start Command**: `cd backend && python app.py`
- **Environment Variables**:
  - `GEMINI_API_KEY`: your_api_key
  - `FLASK_ENV`: production

### Frontend Service  
- **Name**: `solar-loan-frontend`
- **Build Command**: `cd frontend && npm ci && npm run build`
- **Start Command**: `cd frontend && npm start`
- **Environment Variables**:
  - `NODE_ENV`: production
  - `BACKEND_URL`: https://solar-loan-backend.onrender.com

## ✅ Success Indicators
- Both services show "Live" status
- Frontend URL loads the application
- No errors in service logs
- API endpoints respond correctly

## 🆘 Troubleshooting
- **Build fails**: Check logs, verify dependencies
- **Service won't start**: Check start commands and logs
- **API errors**: Verify GEMINI_API_KEY is set correctly
- **Connection errors**: Ensure BACKEND_URL is correct

## 📞 Need Help?
Check the detailed guide in `RENDER_DEPLOYMENT.md` or Render's documentation.
