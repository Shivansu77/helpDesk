# HelpDesk Backend

A Node.js/Express backend for a helpdesk ticket management system with user authentication and JWT-based authorization.

## Features

- **User Authentication**: Register/Login with JWT tokens
- **Ticket Management**: Create, read, update, delete tickets
- **Comments System**: Add comments to tickets
- **User Authorization**: Users can only access their own tickets
- **MongoDB Integration**: Persistent data storage
- **Password Security**: Bcrypt password hashing

## API Endpoints

### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - Login user (returns JWT token)

### Tickets
- `POST /ticket/add-ticket` - Create new ticket
- `GET /ticket/all-tickets` - Get user's tickets
- `GET /ticket/:id` - Get specific ticket
- `PUT /ticket/:id` - Update ticket
- `DELETE /ticket/:id` - Delete ticket
- `POST /ticket/:id/comment` - Add comment to ticket

## Setup

1. Install dependencies: `npm install`
2. Set up MongoDB connection in `src/appMongoose.js`
3. Start server: `npm start`
4. Server runs on port 8000

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Validator for email validation