# Environment Setup Guide

## MongoDB Connection Issue Fix

The error you're seeing is because the `MONGO_URI` environment variable is not set. Follow these steps to fix it:

### Step 1: Create a .env file
Create a file named `.env` in your project root directory (same level as `package.json`) with the following content:

```
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/health-appointment-system

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Step 2: MongoDB Setup Options

#### Option A: Local MongoDB
If you have MongoDB installed locally:
1. Make sure MongoDB is running on your machine
2. Use the connection string: `mongodb://localhost:27017/health-appointment-system`

#### Option B: MongoDB Atlas (Cloud)
If you want to use MongoDB Atlas:
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string and replace the MONGO_URI value
4. Example: `mongodb+srv://username:password@cluster.mongodb.net/health-appointment-system`

#### Option C: Docker MongoDB
If you prefer using Docker:
```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

### Step 3: Install Dependencies
Install the new bcryptjs dependency:
```bash
npm install
```

### Step 4: Restart Your Application
After creating the `.env` file, restart your application:
```bash
npm start
```

### Step 5: Verify Connection
You should see "MongoDB connected successfully" in your console when the application starts successfully.

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/refresh-token` - Refresh access token

### Protected Routes (Require Authorization Header)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/profile` - Delete user account (soft delete)

### Authentication
For protected routes, include the Authorization header:
```
Authorization: Bearer <your-access-token>
```

## Security Notes
- Never commit your `.env` file to version control
- Use strong, unique JWT secrets in production
- Consider using environment-specific configuration files
- Passwords are automatically hashed using bcryptjs
- JWT tokens expire after 24 hours (configurable)
- Refresh tokens expire after 7 days 