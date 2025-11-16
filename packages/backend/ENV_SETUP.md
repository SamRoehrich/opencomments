# Environment Variables Setup

## Creating .env File

Create a `.env` file in `packages/backend/` with the following variables:

```bash
# PlanetScale PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-backend-url.com

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Important Notes

1. **Never commit `.env` file** - It contains secrets. It's already in `.gitignore`.

2. **For Local Development**: The `.env` file is automatically loaded by Bun when running `bun run dev`.

3. **Environment Variables**: The application reads environment variables from `process.env` or from an optional `env` parameter passed to factory functions.

