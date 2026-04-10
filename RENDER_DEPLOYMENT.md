# Deployment Instructions for Render

## Prerequisites
- Git repository with your code
- Render account
- PostgreSQL database (can be created on Render)

## Steps to Deploy on Render

### 1. Prepare Your Repository
Make sure your repository includes:
- All source code
- `package.json` in root directory (with updated scripts)
- `backend/package.json` 
- `.env` file (add to .gitignore, set env vars in Render dashboard)
- `database/schema.sql`

### 2. Update package.json Scripts
Your root `package.json` should have:
```json
{
  "name": "tcg-cards",
  "version": "1.0.0",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "nodemon backend/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.20.0"
  }
}
```

### 3. Create Render Web Service
1. Log in to Render dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - Name: your-app-name
   - Region: choose preferred region
   - Branch: main (or your default branch)
   - Build Command: `npm install`
   - Start Command: `npm start`

### 4. Set Environment Variables
In the Render dashboard for your service, go to "Environment" and add:
- `PORT`: 10000 (Render automatically sets this, but good to have)
- `DB_USER`: your_postgres_username
- `DB_HOST`: your_postgres_host
- `DB_NAME`: your_postgres_database
- `DB_PASSWORD`: your_postgres_password
- `DB_PORT`: 5432
- `JWT_SECRET`: your_secure_jwt_secret

### 5. Add PostgreSQL Database (Optional)
For easier setup, you can add a PostgreSQL database to your Render account:
1. Click "New +" → "PostgreSQL"
2. Configure your database
3. Once created, Render will provide connection details
4. Copy those details to your Web Service environment variables

### 6. Deploy
Click "Create Web Service" and Render will:
1. Clone your repository
2. Run the build command (npm install)
3. Start your service with the start command (npm start)
4. Provide you with a URL (e.g., https://your-app-name.onrender.com)

## Important Notes
- Render automatically sets PORT environment variable - your code already handles this with `process.env.PORT || 5000`
- Make sure your `.env` file is in `.gitignore` so secrets aren't committed
- For production, consider using a proper PostgreSQL instance rather than the default one
- Health check endpoint will be available at: https://your-app-name.onrender.com/api/health

## Troubleshooting
- If you get "port already in use" errors, double-check you're using `process.env.PORT`
- Check Render logs for deployment issues
- Ensure all dependencies are correctly listed in package.json