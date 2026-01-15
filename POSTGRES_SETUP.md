# Postgres Setup Guide (Neon + Vercel)

## 1. Set Up Neon Postgres

### Option A: Through Vercel (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database**
3. Select **Postgres** (powered by Neon)
4. Choose a region and create the database
5. Vercel will automatically set up the connection string

### Option B: Direct Neon Setup

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Copy your connection string

## 2. Get Your Connection String

### If using Vercel:
- Vercel automatically provides environment variables
- The `@vercel/postgres` package uses these automatically
- No manual configuration needed!

### If using Neon directly:
- Copy your connection string from Neon dashboard
- Format: `postgresql://user:password@host/database?sslmode=require`

## 3. Set Up Environment Variables (Local Development)

For local development, create a `.env.local` file:

```env
# If using Vercel Postgres (auto-configured in production)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_connection_string

# Or if using Neon directly
POSTGRES_URL=postgresql://user:password@host/database?sslmode=require
```

**Note:** When deployed to Vercel, these are automatically set if you use Vercel's Postgres integration.

## 4. Create the Database Table

1. In your Neon dashboard (or Vercel Postgres dashboard), go to **SQL Editor**
2. Run the SQL from `supabase-setup.sql` file (renamed for Postgres)
3. This will create the `intake_submissions` table

## 5. Verify the Setup

1. Start your dev server: `pnpm dev`
2. Fill out the intake form
3. Check your database to see the data:
   - **Vercel**: Go to Storage → Your Postgres database → Browse data
   - **Neon**: Go to your project → Tables → `intake_submissions`

## Table Structure

The `intake_submissions` table has the following columns:
- `id` (UUID, primary key)
- `name` (TEXT)
- `platform` (TEXT) - podcast, newsletter, video, or mixed
- `work_link` (TEXT) - URL to their work
- `clarity_focus` (TEXT) - what they want clarity on
- `why_now` (TEXT) - why they want the audit now
- `audit_type` (TEXT) - type of audit requested
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Security Notes

- The API route handles all database access
- No direct client-side database access
- Connection strings should be kept secret (server-side only)
- The `@vercel/postgres` package uses connection pooling automatically

## Troubleshooting

### Local Development Issues

If you're having connection issues locally:
1. Make sure your `.env.local` has the correct `POSTGRES_URL`
2. Check that your Neon database allows connections from your IP
3. Verify the connection string format is correct

### Production Issues

If deployed to Vercel:
- Environment variables are automatically set
- Check Vercel dashboard → Settings → Environment Variables
- Ensure the Postgres database is linked to your project
