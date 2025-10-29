# How to Share This Project

## What to Send Your Friend

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Docker setup"
   git push origin main
   ```

2. **Share the repository link** with your friend

## What Your Friend Needs to Do

1. **Install Docker** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Clone and run:**
   ```bash
   git clone <your-repo-url>
   cd helpdesk
   docker-compose up --build
   ```

3. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

That's it! No Node.js, MongoDB, or npm install needed.