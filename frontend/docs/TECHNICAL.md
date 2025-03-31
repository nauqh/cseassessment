# CSE Exam System: Technical Configuration

This document provides detailed technical information for setting up, configuring, and maintaining the CSE Exam System.

## Table of Contents

- [System Requirements](#system-requirements)
- [Environment Setup](#environment-setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration Files](#configuration-files)
- [Database Configuration](#database-configuration)
- [AWS S3 Configuration](#aws-s3-configuration)
- [Authentication Configuration](#authentication-configuration)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)

## System Requirements

### Minimum Requirements

- **Node.js**: v18.0.0 or higher
- **Python**: v3.9.0 or higher
- **PostgreSQL**: v12.0 or higher
- **Storage**: 10GB+ for application and dependencies
- **Memory**: 4GB+ RAM

### Recommended Configuration

- **Node.js**: v20.0.0 or higher
- **Python**: v3.11.0 or higher
- **PostgreSQL**: v15.0 or higher
- **Storage**: 20GB+ SSD storage
- **Memory**: 8GB+ RAM

## Environment Setup

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cse-exam.git
   cd cse-exam
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

   # API Connection
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd cspyclient
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv env
   # On Windows
   .\env\Scripts\activate
   # On macOS/Linux
   source env/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   # Database
   DB_CONNECTION=postgresql://username:password@localhost/dbname

   # AWS S3
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   ```

5. **Run the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Configuration Files

### Frontend Configuration

- **next.config.ts**: Next.js configuration including rewrites and environment settings
- **tailwind.config.ts**: Tailwind CSS customization
- **components.json**: Shadcn UI component configuration
- **tsconfig.json**: TypeScript configuration

### Backend Configuration

- **.env**: Environment variables for database connection and AWS credentials
- **app/main.py**: FastAPI application configuration
- **requirements.txt**: Python package dependencies

## Database Configuration

The application uses PostgreSQL as its primary database. The database schema is managed through SQLAlchemy models.

### Database Schema

The main tables in the database include:

1. **submissions**: Stores all exam submissions with the following structure:
   - `id` (primary key)
   - `email` (student identifier)
   - `exam_id` (exam identifier)
   - `exam_name` (human-readable exam name)
   - `answers` (JSON containing student answers)
   - `submitted_at` (timestamp)
   - `status` (marking, completed, failed, incompleted)
   - `summary` (text summary of results)
   - `score` (numerical score)
   - `channel` (optional external reference)

### Connection Configuration

The database connection is configured in `app/database.py` using SQLAlchemy. The connection string is provided via the environment variable `DB_CONNECTION`.

## AWS S3 Configuration

The application uses AWS S3 for storing exam content and solutions.

### Bucket Structure

- `exams/`: Contains exam definition files (JSON format)
- `solutions/`: Contains reference solutions for autograding

### Required Permissions

The AWS IAM user used for the application should have the following permissions:
- `s3:GetObject`
- `s3:PutObject`
- `s3:ListBucket`

## Authentication Configuration

The application uses Clerk for user authentication.

### Clerk Setup

1. Create a Clerk application at https://clerk.dev
2. Configure the authentication flow with the following settings:
   - Sign-in methods: Email/password, OAuth providers (optional)
   - Redirect URLs: Configure for your domain
   - User metadata: Configure any custom fields

3. Add the Clerk public and secret keys to your environment variables

### Protected Routes

Routes are protected via the middleware defined in `src/middleware.ts`. Public routes like the landing page and `/v0` exam routes are accessible without authentication.

## Security Considerations

### Frontend Security

- Client-side validation for form inputs
- XSS protection through React's built-in security features
- CSRF protection via Clerk's authentication tokens

### Backend Security

- Input validation using Pydantic models
- SQL injection protection through SQLAlchemy ORM
- Secure code execution environment for student code
- Rate limiting for sensitive endpoints
- Proper error handling to prevent information disclosure

## Performance Optimization

### Frontend Optimization

- Code splitting for improved load times
- Static generation for suitable pages
- Image optimization with Next.js Image component
- Proper caching strategies

### Backend Optimization

- Database connection pooling
- Optimized database queries
- Caching frequently accessed exam content
- Asynchronous processing for time-consuming operations
