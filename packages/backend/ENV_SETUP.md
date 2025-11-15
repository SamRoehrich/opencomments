# Environment Variables Setup

## Creating .env File

Create a `.env` file in `packages/backend/` with the following variables:

```bash
# PlanetScale PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-worker.workers.dev

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Deploying with .env File

You can now deploy using:

```bash
# Deploy to default environment
npm run deploy
# or
npx wrangler deploy --env-file=./.env

# Deploy to production
npm run deploy:production

# Deploy to staging
npm run deploy:staging
```

## Setting Secrets in Cloudflare

**Important**: The `--env-file` flag loads variables for the build process, but for the Worker runtime, you need to set them as secrets:

```bash
# Set secrets (you'll be prompted to enter values)
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# Or set them non-interactively from .env file:
cat .env | grep DATABASE_URL | cut -d '=' -f2 | wrangler secret put DATABASE_URL
cat .env | grep BETTER_AUTH_SECRET | cut -d '=' -f2 | wrangler secret put BETTER_AUTH_SECRET
# etc.
```

## Important Notes

1. **Never commit `.env` file** - It contains secrets. It's already in `.gitignore`.

2. **For Local Development**: The `.env` file is automatically loaded by Bun.

3. **Hyperdrive**: If using Hyperdrive, you don't need `DATABASE_URL` as a secret (Hyperdrive handles it), but you still need other secrets.

4. **Runtime vs Build**: Variables in `.env` are available during build, but secrets are needed at runtime.

