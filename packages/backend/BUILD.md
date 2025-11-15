# Build Command for Cloudflare Workers

## Build Command

For the Cloudflare Workers GUI, use this build command with Bun:

```bash
bun install --frozen-lockfile || bun install
```

This will:
1. Try to install with frozen lockfile (fails if lockfile is out of sync)
2. If that fails, update the lockfile and install (for Cloudflare's build environment)

## Fixing Lockfile Issues

If Cloudflare build fails due to lockfile changes, run this locally from the **repository root**:

```bash
cd packages/backend
bun install
cd ../..
bun install
git add bun.lock packages/backend/bun.lock
git commit -m "Update lockfiles"
git push
```

Or from the root (if using workspace):

```bash
bun install
git add bun.lock packages/backend/bun.lock
git commit -m "Update lockfiles"
git push
```

## Alternative Commands

If Bun is not available in the Cloudflare build environment:

```bash
npm install
```

Or with explicit Bun installation:

```bash
curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install
```

## How It Works

Cloudflare Workers uses Wrangler to automatically:
- Bundle TypeScript files
- Resolve dependencies
- Optimize the code for the Workers runtime

The `build` script in `package.json` is a placeholder. Wrangler handles the actual bundling during deployment.

## Alternative: Direct Wrangler Build

You can also use Wrangler's build command directly:

```bash
npm install && npx wrangler deploy --dry-run
```

This will:
1. Install dependencies
2. Validate and bundle your code
3. Show what would be deployed (without actually deploying)

## For Cloudflare Dashboard

In the Cloudflare Workers dashboard:
1. Go to your Worker → Settings → Builds
2. Set the build command to: `npm install`
3. Wrangler will automatically handle TypeScript bundling

## Local Development

For local development and testing:

```bash
# Install dependencies
bun install

# Run locally with Wrangler
npx wrangler dev

# Or use Bun's dev server
bun run dev
```

