#!/bin/bash
# Cloudflare Workers Build Script for Monorepo
# This script handles workspace dependency resolution

set -e

# Install Bun if not available
if ! command -v bun &> /dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Install dependencies from root (required for workspace resolution)
echo "Installing workspace dependencies..."
bun install --frozen-lockfile || bun install

echo "Build complete - Wrangler will bundle TypeScript automatically"

