# Deployment Guide for HelpDesk Application

This guide provides step-by-step instructions to deploy the HelpDesk application to production.

## Pre-Deployment Checklist

- [ ] MongoDB database is set up (MongoDB Atlas recommended)
- [ ] MongoDB connection string is ready
- [ ] GitHub account is set up
- [ ] Code is pushed to GitHub repository
- [ ] Vercel account is created (for backend)
- [ ] Netlify account is created (for frontend)

## Step 1: Deploy Backend to Vercel

### 1.1 Prepare MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs, or specific IPs)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net`

### 1.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

6. Add Environment Variables:
   ```
   MONGO_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net
   DB_NAME=helpdesk
   JWT_SECRET=your-very-secure-random-secret-key-here
   ```
   
   **Important**: Generate a strong JWT secret. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### 1.3 Test Backend

Visit `https://your-backend.vercel.app/user/me` - you should get a 401 error (this is correct, as you're not authenticated).

## Step 2: Deploy Frontend to Netlify

### 2.1 Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

6. Add Environment Variable:
   - Click "Show advanced"
   - Add new variable:
     ```
     REACT_APP_API_URL=https://your-backend.vercel.app
     ```
   - Replace `https://your-backend.vercel.app` with your actual Vercel backend URL from Step 1.9

7. Click "Deploy site"
8. Wait for deployment to complete

### 2.2 Configure Redirects (if needed)

Netlify should automatically handle React Router redirects, but if you encounter 404 errors on page refresh, the `netlify.toml` file in the frontend directory already handles this.

## Step 3: Test Your Deployment

1. Visit your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Test user registration:
   - Click "Register"
   - Create a new account (try with role: user)
   - You should be redirected to login
3. Test login:
   - Login with your new credentials
   - You should see the dashboard
4. Test ticket creation:
   - Click "Create New Ticket"
   - Fill in the form
   - Submit
   - Verify the ticket appears on the dashboard
5. Test ticket operations:
   - View ticket details
   - Edit a ticket
   - Delete a ticket

6. Test admin functionality (optional):
   - Register a new user with role: admin
   - Login as admin
   - Verify you can see all tickets
   - Test adding comments to tickets

## Step 4: Configure Custom Domain (Optional)

### For Frontend (Netlify)
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### For Backend (Vercel)
1. Go to Settings → Domains
2. Add custom domain
3. Follow DNS configuration instructions
4. Update `REACT_APP_API_URL` in Netlify to use the new custom domain

## Troubleshooting

### Backend Issues

**Problem**: "MongoDB connection failed"
- **Solution**: Check your MongoDB connection string, ensure IP whitelist includes 0.0.0.0/0 or Vercel's IPs

**Problem**: "JWT verification failed"
- **Solution**: Ensure JWT_SECRET is set in Vercel environment variables

**Problem**: 500 Internal Server Error
- **Solution**: Check Vercel logs (Functions → View Logs)

### Frontend Issues

**Problem**: "Cannot connect to server"
- **Solution**: Verify `REACT_APP_API_URL` is correctly set in Netlify

**Problem**: CORS errors
- **Solution**: The backend already has CORS enabled. If still seeing errors, check your backend URL is correct

**Problem**: 404 on page refresh
- **Solution**: The `netlify.toml` file handles this. Ensure it's in the frontend directory

**Problem**: Build fails
- **Solution**: Check build logs in Netlify. Ensure Node.js version is compatible (v18+ recommended)

### Environment Variable Changes

If you need to update environment variables:

**Vercel (Backend)**:
1. Go to Settings → Environment Variables
2. Edit or add variables
3. Redeploy (Deployments → three dots → Redeploy)

**Netlify (Frontend)**:
1. Go to Site settings → Build & deploy → Environment
2. Edit or add variables
3. Trigger new deploy (Deploys → Trigger deploy → Deploy site)

## Security Best Practices

1. **Never commit .env files** - They're already in .gitignore
2. **Use strong JWT secrets** - Generate with crypto.randomBytes
3. **Whitelist MongoDB IPs** - Use specific IPs when possible
4. **Rotate secrets regularly** - Change JWT_SECRET periodically
5. **Monitor logs** - Check Vercel and Netlify logs for suspicious activity
6. **Use HTTPS** - Both Vercel and Netlify provide free SSL certificates

## Monitoring and Maintenance

1. **Monitor Vercel Functions**: Check usage and errors in Vercel dashboard
2. **Monitor Netlify Bandwidth**: Check build minutes and bandwidth usage
3. **Database Monitoring**: Use MongoDB Atlas monitoring tools
4. **Update Dependencies**: Regularly update npm packages for security patches
5. **Backup Database**: Set up regular MongoDB backups

## Cost Optimization

### Free Tier Limits

**Vercel**:
- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- Unlimited deployments

**Netlify**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**MongoDB Atlas**:
- 512 MB storage (free tier)
- Shared cluster

### If You Exceed Free Tier

- Consider upgrading to paid plans
- Optimize database queries
- Implement caching
- Use CDN for static assets

## Alternative Deployment Options

### Backend Alternatives
- **Railway**: Easy deployment with database included
- **Render**: Free tier with PostgreSQL option
- **Heroku**: Classic PaaS (note: free tier discontinued)
- **DigitalOcean App Platform**: $5/month starter

### Frontend Alternatives
- **Vercel**: Also excellent for React apps
- **GitHub Pages**: Free, but doesn't support server-side features
- **Cloudflare Pages**: Free with good performance
- **AWS Amplify**: Integrates well with AWS services

## Need Help?

- Check application logs in Vercel/Netlify dashboards
- Review MongoDB Atlas metrics
- Verify all environment variables are set correctly
- Ensure your code is up to date with the latest from the repository

## Quick Reference

### Environment Variables

**Backend (Vercel)**:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=helpdesk
JWT_SECRET=your-secure-secret-key
```

**Frontend (Netlify)**:
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

### Build Commands

**Backend**: No build command needed (serverless functions)
**Frontend**: `npm run build`

### Important URLs

- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.vercel.app`
- MongoDB: `https://cloud.mongodb.com`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Netlify Dashboard: `https://app.netlify.com`
