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
3. Set environment variables:
   - `MONGO_URL`: Your MongoDB connection string
   - `DB_NAME`: Database name
   - `JWT_SECRET`: JWT secret key

### Frontend (Netlify)

1. Push frontend code to GitHub
2. Connect to Netlify
3. Update API URLs in frontend to point to deployed backend

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=helpdesk
PORT=8000
JWT_SECRET=your-secret-key
```

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