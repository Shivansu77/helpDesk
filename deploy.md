# Deployment Guide

## Quick Deployment Steps

### 1. Backend Deployment (Vercel)

1. **Prepare Backend**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git branch -M main
   git remote add origin <your-backend-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your backend repository
   - Set environment variables:
     - `MONGO_URL`: `mongodb+srv://shivansu77:%40Shark77@cluster0.nh0wxfn.mongodb.net`
     - `DB_NAME`: `helpdesk`
     - `JWT_SECRET`: `your-secure-jwt-secret-key`
   - Deploy

### 2. Frontend Deployment (Netlify)

1. **Update API URLs**:
   - Replace `http://localhost:8000` with your Vercel backend URL in all frontend files

2. **Prepare Frontend**:
   ```bash
   cd frontend
   npm run build
   git init
   git add .
   git commit -m "Initial frontend commit"
   git branch -M main
   git remote add origin <your-frontend-repo-url>
   git push -u origin main
   ```

3. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import your frontend repository
   - Build settings: `npm run build`
   - Publish directory: `build`
   - Deploy

### 3. Update Frontend API URLs

After backend deployment, update these files with your Vercel URL:

- `src/pages/Dashboard.js`
- `src/pages/Login.js`
- `src/pages/Register.js`
- `src/pages/TicketDetails.js`
- `src/pages/CreateTicket.js`
- `src/pages/EditTicket.js`
- `src/context/UserContext.js`

Replace `http://localhost:8000` with `https://your-backend.vercel.app`

### 4. Test Deployment

1. Visit your Netlify frontend URL
2. Register a new user
3. Create tickets
4. Test all functionality

## Alternative Deployment Options

### Backend Alternatives:
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic PaaS option

### Frontend Alternatives:
- **Vercel**: Also good for React apps
- **GitHub Pages**: Free static hosting
- **Firebase Hosting**: Google's hosting solution

## Environment Variables Needed

### Backend:
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name (helpdesk)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Port number (auto-set by Vercel)

### Frontend:
- `REACT_APP_API_URL`: Backend API URL (optional, can hardcode)

## Troubleshooting

1. **CORS Issues**: Backend already has CORS enabled
2. **Environment Variables**: Double-check all env vars are set
3. **Build Errors**: Check Node.js version compatibility
4. **Database Connection**: Verify MongoDB URL and whitelist IPs