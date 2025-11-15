# Hyperdrive Setup for PlanetScale PostgreSQL

This guide explains how to set up Cloudflare Hyperdrive to connect your Worker to PlanetScale PostgreSQL.

## Step 1: Create Hyperdrive Configuration

Run this command from the `packages/backend` directory:

```bash
cd packages/backend
npx wrangler hyperdrive create opencomments-db --connection-string="postgresql://username:password@host:port/database?sslmode=require"
```

Replace the connection string with your actual PlanetScale PostgreSQL connection string from the PlanetScale dashboard.

This will output a Hyperdrive ID like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Step 2: Update wrangler.toml

Copy the Hyperdrive ID and update `wrangler.toml`:

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id-here"
```

## Step 3: Deploy

After updating the Hyperdrive ID, deploy your Worker:

```bash
npx wrangler deploy
```

Or push to main/master branch and GitHub Actions will deploy automatically.

## How It Works

1. **Hyperdrive** acts as a connection pooler between Cloudflare Workers and PlanetScale
2. Your Worker code uses the `HYPERDRIVE` binding from `env`
3. The `createDb()` function detects `env.HYPERDRIVE` and uses it for the connection
4. If Hyperdrive is not configured, it falls back to `DATABASE_URL` from environment variables

## Environment Variables

You still need to set these secrets in Cloudflare (for fallback and auth):

- `DATABASE_URL` - PlanetScale connection string (fallback if Hyperdrive not configured)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Testing Locally

For local development with Bun, Hyperdrive is not used. The code falls back to `DATABASE_URL` from your `.env` file or `process.env`.

