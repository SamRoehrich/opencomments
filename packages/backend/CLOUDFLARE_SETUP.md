# Cloudflare Workers GUI Configuration

## Current (Incorrect) Settings

```
Build command: bun build index.ts
Deploy command: npx wrangler versions upload
Root directory: /packages/backend
```

## Correct Settings

### In Cloudflare Workers Dashboard → Settings → Builds:

```
Build command: bun install

Deploy command: (leave empty) OR npx wrangler deploy

Root directory: (leave EMPTY - repository root)
```

**Note**: Cloudflare already has Bun installed (v1.2.15), so we can use `bun install` directly. This will update the lockfile if needed.

## Why These Changes?

1. **Root directory must be EMPTY** - This is a monorepo workspace. Setting it to `/packages/backend` prevents workspace dependencies (`@opencomments/types`) from being resolved.

2. **Build command installs dependencies** - Wrangler automatically bundles TypeScript. You don't need `bun build`. The build command just needs to ensure dependencies are installed.

3. **Deploy command** - `npx wrangler versions upload` is for versioned deployments. Use `npx wrangler deploy` or leave empty (Wrangler handles it).

## Step-by-Step Fix

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Builds
2. **Root directory**: Delete `/packages/backend` (leave empty)
3. **Build command**: Replace with:
   ```bash
   curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install --frozen-lockfile || bun install
   ```
4. **Deploy command**: Change to `npx wrangler deploy` or leave empty
5. Save and try deploying again

## Alternative (If Bun is Pre-installed)

If Cloudflare's environment already has Bun:

**Build command**:
```bash
bun install --frozen-lockfile || bun install
```

**Root directory**: (empty)

**Deploy command**: (empty or `npx wrangler deploy`)

