# HelpDesk Application

A full-stack helpdesk ticket management system with role-based access control.

## Features

- **User Authentication**: JWT-based login/register
- **Role Management**: Admin and User roles
- **Ticket Management**: Create, view, edit, delete tickets
- **Comments System**: Admin-only commenting on tickets
- **Search & Filter**: Filter tickets by status, priority, and search
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, JWT
- **Database**: MongoDB with Mongoose

## Deployment

### Backend (Vercel)

1. Push backend code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGO_URL`: Your MongoDB connection string
   - `DB_NAME`: Database name (e.g., helpdesk)
   - `JWT_SECRET`: Secure JWT secret key (generate a random string)
4. Deploy

### Frontend (Netlify)

1. Push frontend code to GitHub
2. Connect to Netlify
3. Set environment variable in Netlify dashboard:
   - `REACT_APP_API_URL`: Your deployed backend URL (e.g., https://your-backend.vercel.app)
4. Build command: `npm run build`
5. Publish directory: `build`
6. Deploy

**Note**: The frontend now uses environment variables for API URLs, so no code changes are needed for deployment!

## Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB credentials
npm install
npm start
```

### Frontend
```bash
cd frontend
cp .env.example .env
# For local development, the default http://localhost:8000 is already set
npm install
npm start
```

## Environment Variables

### Backend (.env)
See `backend/.env.example` for template:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=helpdesk
PORT=8000
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
```

### Frontend (.env)
See `frontend/.env.example` for template:
```
REACT_APP_API_URL=http://localhost:8000
```
For production deployment, set `REACT_APP_API_URL` to your deployed backend URL.

## API Endpoints

- `POST /user/register` - Register user
- `POST /user/login` - Login user
- `GET /user/me` - Get user info
- `GET /ticket/all-tickets` - Get all tickets
- `GET /ticket/stats` - Get ticket statistics
- `GET /ticket/:id` - Get ticket by ID
- `POST /ticket/add-ticket` - Create ticket
- `PUT /ticket/:id` - Update ticket
- `DELETE /ticket/:id` - Delete ticket
- `POST /ticket/:id/comment` - Add comment (Admin only)

## User Roles

- **User**: Can create, view, edit, and delete their own tickets
- **Admin**: Can view all tickets, add comments, cannot edit tickets