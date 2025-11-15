# Build Command for Cloudflare Workers

## Build Command for Cloudflare Workers GUI

Since this is a **monorepo workspace**, Cloudflare needs to install dependencies from the root. Use these settings:

### Correct Configuration

**In Cloudflare Workers Dashboard → Settings → Builds:**

1. **Root directory**: Leave **EMPTY** (repository root) - **NOT** `/packages/backend`
2. **Build command**: 
```bash
bun install
```

3. **Deploy command**: Leave empty (Wrangler handles this automatically) OR use:
```bash
npx wrangler deploy
```

**Note**: Cloudflare already has Bun installed, so we don't need the curl command. Using `bun install` (without `--frozen-lockfile`) will update the lockfile if needed.

**DO NOT USE**:
- ❌ Root directory: `/packages/backend` (breaks workspace dependencies)
- ❌ Build command: `bun build index.ts` (Wrangler handles bundling)
- ❌ Deploy command: `npx wrangler versions upload` (wrong command)

### Why This Works

1. **Root directory empty** = Repository root, so workspace dependencies resolve
2. **Build command installs deps** = Resolves `@opencomments/types` workspace dependency
3. **Wrangler auto-bundles** = Reads `wrangler.toml` and bundles `index.ts` automatically
4. **No manual build needed** = Wrangler handles TypeScript → JavaScript conversion

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

