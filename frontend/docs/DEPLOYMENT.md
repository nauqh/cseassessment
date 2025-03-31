# CSE Exam System: Deployment Guide

This document outlines the deployment process for the CSE Exam System, including both the Next.js frontend and FastAPI backend components.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
  - [Vercel Deployment](#vercel-deployment)
  - [Docker Deployment](#docker-deployment)
  - [Traditional Hosting](#traditional-hosting)
- [Backend Deployment](#backend-deployment)
  - [Heroku Deployment](#heroku-deployment)
  - [Docker Deployment](#docker-deployment-1)
  - [VPS/Server Deployment](#vpsserver-deployment)
- [Database Setup](#database-setup)
- [AWS S3 Configuration](#aws-s3-configuration)
- [Environment Variables](#environment-variables)
- [Continuous Integration and Deployment](#continuous-integration-and-deployment)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Overview

The CSE Exam System consists of two main components:

1. **Frontend**: A Next.js application for the user interface
2. **Backend**: A FastAPI application for business logic and data processing

Both components need to be deployed and properly configured to work together.

## Prerequisites

Before deployment, ensure you have:

- Access to deployment platforms (Vercel, Heroku, VPS, etc.)
- PostgreSQL database server
- AWS account with S3 access
- Clerk account for authentication
- Domain name (optional but recommended)

## Frontend Deployment

### Vercel Deployment

Vercel is the recommended platform for Next.js applications:

1. **Connect Repository**:
   - Log in to Vercel and import your repository
   - Select the repository containing the CSE Exam System

2. **Configure Project**:
   - Set up your project name
   - Configure the build settings:
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Output directory: `.next`

3. **Set Environment Variables**:
   - Add all required environment variables from your `.env.local` file
   - Ensure `NEXT_PUBLIC_API_URL` points to your deployed backend

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide a URL for your deployed application

### Docker Deployment

For Docker-based deployments:

1. **Create a Dockerfile in the root directory**:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Update `next.config.ts` for standalone output**:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // other config options
};

export default nextConfig;
```

3. **Build and run the Docker image**:

```bash
# Build the image
docker build -t cse-exam-frontend:latest .

# Run the container
docker run -p 3000:3000 --env-file .env.production cse-exam-frontend:latest
```

### Traditional Hosting

For traditional hosting environments:

1. **Build the application locally**:

```bash
npm run build
```

2. **Deploy the built application**:
   - Upload the `.next` directory, `public` directory, `package.json`, and `package-lock.json`
   - Install production dependencies: `npm ci --production`
   - Start the server: `npm start`

## Backend Deployment

### Heroku Deployment

To deploy the FastAPI backend to Heroku:

1. **Ensure you have a `Procfile` in the cspyclient directory**:

```
web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}
```

2. **Create a new Heroku app**:

```bash
heroku create cse-exam-backend
```

3. **Set up environment variables**:

```bash
heroku config:set DB_CONNECTION=postgresql://...
heroku config:set AWS_ACCESS_KEY_ID=your_access_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret_key
heroku config:set AWS_REGION=your_region
```

4. **Deploy the application**:

```bash
git subtree push --prefix cspyclient heroku main
```

### Docker Deployment

For Docker-based deployment of the backend:

1. **Create a Dockerfile in the cspyclient directory**:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Build and run the Docker image**:

```bash
# Build the image
docker build -t cse-exam-backend:latest .

# Run the container
docker run -p 8000:8000 --env-file .env cse-exam-backend:latest
```

### VPS/Server Deployment

For deployment on a VPS or dedicated server:

1. **Set up the server**:
   - Install Python 3.9+ and required system dependencies
   - Set up a virtual environment

2. **Deploy the application**:
   - Clone the repository or upload the application files
   - Install dependencies: `pip install -r requirements.txt`
   - Set up environment variables in a `.env` file

3. **Set up a production server**:

```bash
# Install Gunicorn
pip install gunicorn

# Start the application with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

4. **Set up Nginx as a reverse proxy**:

```nginx
server {
    listen 80;
    server_name your-backend-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Setup

### PostgreSQL Setup

1. **Create a new PostgreSQL database**:

```sql
CREATE DATABASE cse_exam;
CREATE USER cse_exam_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cse_exam TO cse_exam_user;
```

2. **Configure connection string**:
   - Update the `DB_CONNECTION` environment variable:
   ```
   DB_CONNECTION=postgresql://cse_exam_user:your_password@localhost/cse_exam
   ```

3. **Tables will be automatically created** by SQLAlchemy when the backend first runs

## AWS S3 Configuration

1. **Create an S3 bucket**:
   - Name: `csexam` (or your preferred name)
   - Enable appropriate CORS settings for access from your domain

2. **Create necessary folders**:
   - `exams/`: For exam definition files
   - `solutions/`: For reference solutions

3. **Upload initial exam files**:
   - Create and upload JSON exam definition files to the `exams/` directory

4. **Set up IAM User**:
   - Create a user with programmatic access
   - Attach policies for S3 access
   - Note the access key and secret key for environment variables

## Environment Variables

### Frontend Environment Variables

Create a `.env.local` (development) or `.env.production` (production) file:

```
# API Connection
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
```

### Backend Environment Variables

Create a `.env` file in the cspyclient directory:

```
# Database
DB_CONNECTION=postgresql://username:password@host/database

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
```

## Continuous Integration and Deployment

### GitHub Actions Setup

Create a workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy CSE Exam System

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "cse-exam-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "cspyclient"
```

## Post-Deployment Verification

After deployment, verify the system is working correctly:

1. **Check frontend accessibility**:
   - Navigate to your frontend URL
   - Verify that the login page loads correctly
   - Test authentication flow

2. **Verify backend API**:
   - Access the API documentation at `/docs`
   - Test basic endpoints
   - Ensure database connectivity

3. **Test exam flow**:
   - Complete an end-to-end exam process
   - Verify that submissions are stored properly
   - Check that grading works as expected

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify that the backend CORS settings include your frontend domain
   - Check for protocol mismatches (http vs https)

2. **Database Connection Issues**:
   - Verify connection string format
   - Check network access to database server
   - Ensure database user has proper permissions

3. **S3 Access Problems**:
   - Check IAM permissions
   - Verify bucket name and region settings
   - Ensure proper environment variables are set

4. **Authentication Failures**:
   - Verify Clerk configuration
   - Check environment variables for correct API keys
   - Ensure redirect URLs are properly configured

### Getting Help

If you encounter issues not covered in this guide:

1. Check the error logs in your deployment platform
2. Refer to the platform-specific troubleshooting guides
3. Contact the CSE Exam System development team for support
