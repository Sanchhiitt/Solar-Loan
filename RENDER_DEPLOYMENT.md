# Render Deployment Guide

This guide will help you deploy your Solar Loan Fit Checker application to Render.

## Overview

Your application consists of two services:
1. **Backend**: Flask API (Python) that handles data processing and Gemini AI calculations
2. **Frontend**: Express + React (TypeScript) that serves the UI and proxies API calls

## Prerequisites

1. [Render Account](https://render.com) - Sign up for free
2. GitHub repository with your code
3. Gemini API key from Google AI Studio

## Deployment Methods

### Method 1: Using render.yaml (Recommended)

1. **Push your code to GitHub** (if not already done)
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**:
   - After deployment starts, go to each service in Render dashboard
   - For the backend service, add:
     - `GEMINI_API_KEY`: Your actual Gemini API key
   - Frontend service will automatically get the backend URL

### Method 2: Manual Service Creation

#### Step 1: Deploy Backend Service

1. **Create Backend Service**:
   - Go to Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `solar-loan-backend`
     - **Runtime**: `Python 3`
     - **Build Command**: `cd backend && pip install -r requirements.txt`
     - **Start Command**: `cd backend && python app.py`
     - **Plan**: Free

2. **Set Backend Environment Variables**:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   FLASK_ENV=production
   HOST=0.0.0.0
   ```

3. **Deploy and note the URL** (e.g., `https://solar-loan-backend.onrender.com`)

#### Step 2: Deploy Frontend Service

1. **Create Frontend Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `solar-loan-frontend`
     - **Runtime**: `Node`
     - **Build Command**: `cd frontend && npm ci && npm run build`
     - **Start Command**: `cd frontend && npm start`
     - **Plan**: Free

2. **Set Frontend Environment Variables**:
   ```
   NODE_ENV=production
   BACKEND_URL=https://solar-loan-backend.onrender.com
   ```

## Environment Variables Reference

### Backend Service
| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your API key | Google Gemini API key |
| `FLASK_ENV` | `production` | Flask environment |
| `HOST` | `0.0.0.0` | Host binding |
| `PORT` | Auto-set by Render | Service port |

### Frontend Service
| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `BACKEND_URL` | Backend service URL | URL of deployed backend |
| `PORT` | Auto-set by Render | Service port |

## File Structure

```
project-root/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── build.sh
│   └── start.sh
├── frontend/
│   ├── package.json
│   ├── server/
│   └── client/
├── render.yaml
├── .env.example
└── RENDER_DEPLOYMENT.md
```

## Monitoring and Logs

- **View Logs**: Go to service dashboard → "Logs" tab
- **Monitor Health**: Check service status in dashboard
- **Health Endpoint**: `https://your-frontend-url.onrender.com/api/health`

## Custom Domains

1. Go to service dashboard
2. Click "Settings" → "Custom Domains"
3. Add your domain and configure DNS

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in requirements.txt/package.json
   - Verify build commands are correct

2. **Backend Connection Errors**:
   - Verify BACKEND_URL is correctly set in frontend
   - Check backend service is running and accessible
   - Ensure CORS is enabled in backend

3. **Gemini API Errors**:
   - Verify API key is correct and has quota
   - Check API key is properly set in environment variables

4. **Service Won't Start**:
   - Check start command is correct
   - Verify port configuration
   - Review service logs for errors

### Debugging Commands

- **View Logs**: Check "Logs" tab in service dashboard
- **Environment Variables**: Check "Environment" tab
- **Restart Service**: Use "Manual Deploy" button
- **Shell Access**: Use "Shell" tab (paid plans only)

## Performance Optimization

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- 750 hours/month limit across all services
- Limited CPU and memory

### Optimization Tips
1. **Keep Services Warm**: Use uptime monitoring services
2. **Optimize Build Time**: Cache dependencies when possible
3. **Monitor Usage**: Check dashboard for resource usage

## Cost Considerations

- **Free Tier**: Good for development and testing
- **Paid Plans**: Start at $7/month per service for production
- **Database**: Consider external database for persistence

## Security Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **HTTPS**: Render provides SSL certificates automatically
3. **CORS**: Properly configure CORS for production
4. **API Keys**: Rotate keys regularly

## Backup and Recovery

1. **Code**: Keep code in version control (GitHub)
2. **Environment Variables**: Document all required variables
3. **Database**: Regular backups if using external database
4. **Logs**: Download important logs before they rotate

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com
- **Support**: Available through dashboard (paid plans)

## Quick Start Checklist

### Before Deployment
- [ ] Push code to GitHub repository
- [ ] Get Gemini API key from Google AI Studio
- [ ] Create Render account

### Deployment Steps
- [ ] Connect GitHub repo to Render
- [ ] Deploy using render.yaml blueprint OR create services manually
- [ ] Set GEMINI_API_KEY in backend service environment variables
- [ ] Wait for both services to deploy (5-10 minutes)
- [ ] Test application at frontend URL

### After Deployment
- [ ] Test all features work correctly
- [ ] Set up uptime monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Monitor resource usage

## Next Steps After Deployment

1. **Test Application**: Verify all features work correctly
2. **Set Up Monitoring**: Configure uptime monitoring
3. **Custom Domain**: Add your domain if needed
4. **Performance Testing**: Test under load
5. **Backup Strategy**: Implement backup procedures
