# Backend Deployment Guide

This guide explains how to deploy the backend to Cloudflare Workers.

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Cloudflare Secrets
- **`CLOUDFLARE_API_TOKEN`** - Your Cloudflare API token
  - Create at: https://dash.cloudflare.com/profile/api-tokens
  - Permissions needed: Account → Cloudflare Workers → Edit
  
- **`CLOUDFLARE_ACCOUNT_ID`** - Your Cloudflare account ID
  - Find at: https://dash.cloudflare.com/ (right sidebar)

### Database Secrets
- **`DATABASE_URL`** - PlanetScale PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database?sslmode=require`
  - Get from your PlanetScale dashboard

### Authentication Secrets
- **`BETTER_AUTH_SECRET`** - Secret key for better-auth
  - Generate a random string (e.g., `openssl rand -base64 32`)
  
- **`BETTER_AUTH_URL`** - Public URL where your auth endpoints are accessible
  - Example: `https://your-worker.your-subdomain.workers.dev`
  - Or your custom domain if configured

### GitHub OAuth Secrets
- **`GITHUB_CLIENT_ID`** - GitHub OAuth App Client ID
  - Create at: https://github.com/settings/developers
  - Authorization callback URL: `{BETTER_AUTH_URL}/api/auth/callback/github`
  
- **`GITHUB_CLIENT_SECRET`** - GitHub OAuth App Client Secret
  - From the same GitHub OAuth App

## Deployment Behavior

The workflow automatically deploys on **every push to `main` or `master` branch**.

You can also manually trigger deployments:
1. Go to Actions → Deploy Backend to Cloudflare Workers
2. Click "Run workflow"
3. Select environment (production or staging)
4. Click "Run workflow"

## Environment Configuration

The workflow supports two environments:
- **production** - Deployed to `opencomments-backend` worker
- **staging** - Deployed to `opencomments-backend-staging` worker

Each environment has its own secrets configured via GitHub Environments.

## Verifying Deployment

After deployment, check:
1. Cloudflare Dashboard → Workers & Pages
2. Your worker should show the latest deployment
3. Test your API endpoints at: `https://your-worker.your-subdomain.workers.dev/api`

