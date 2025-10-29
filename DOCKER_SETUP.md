# Docker Setup Guide

## Quick Start

1. **Clone the repository**
2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

## What's Included

- **Backend**: Node.js API server
- **Frontend**: React application  
- **Database**: MongoDB instance
- **Auto-setup**: All dependencies installed automatically

## Environment Variables

### Using External MongoDB (Atlas, etc.)

Create a `.env` file in the root directory:

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=helpdesk
JWT_SECRET=your-secure-secret-key
```

Then remove the mongo service from docker-compose.yml or run:
```bash
docker-compose up backend frontend
```

## Commands

- **Start**: `docker-compose up`
- **Build & Start**: `docker-compose up --build`
- **Stop**: `docker-compose down`
- **Clean**: `docker-compose down -v` (removes data)