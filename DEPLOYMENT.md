# Vercel Deployment Guide

## Database Setup (Required)

Since SQLite doesn't work on Vercel's serverless environment, you need to set up a PostgreSQL database:

### Option 1: Vercel Marketplace - Neon (Recommended)
1. Go to your Vercel project dashboard
2. Go to "Storage" tab or "Marketplace"
3. Select "Neon" from the database providers
4. Click "Add" or "Install"
5. Follow the setup prompts to create a PostgreSQL database
6. Once created, go to the database settings
7. Copy the `DATABASE_URL` connection string

### Option 2: Vercel Marketplace - Supabase
1. Go to your Vercel project dashboard
2. Go to "Storage" tab or "Marketplace"
3. Select "Supabase" from the database providers
4. Click "Add" or "Install"
5. Create a new Supabase project
6. Go to Settings → Database → Connection string
7. Copy the URI and use it as `DATABASE_URL`

### Option 3: Direct Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the URI and use it as `DATABASE_URL`

## Environment Variables

In your Vercel project dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add these variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate a random secret (use: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your deployed URL (e.g., `https://your-app.vercel.app`)
   - `JWT_SECRET`: Generate another random secret

## Database Migration

After setting up the database:
1. Run locally: `npx prisma db push`
2. Or add a build script in Vercel to handle migrations

## Deploy to Vercel

### Option 1: GitHub Integration (Easiest)
1. Push your code to GitHub
2. Connect your Vercel account to GitHub
3. Import the repository
4. Configure environment variables
5. Deploy

### Option 2: Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Configure environment variables in the dashboard

## Post-Deployment

1. Test the login functionality
2. Verify database connectivity
3. Check that all API routes work correctly

## Troubleshooting

- **Database Connection Error**: Ensure `DATABASE_URL` is correct and database is accessible
- **Login Issues**: Check that all environment variables are set correctly
- **Build Failures**: Verify `prisma generate` runs successfully during build
