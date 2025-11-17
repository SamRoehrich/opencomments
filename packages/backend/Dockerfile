# Use the official Bun image as base
FROM oven/bun:debian AS base
WORKDIR /app

# Install dependencies stage - only install what's needed
FROM base AS deps
# Copy only necessary files for workspace resolution
COPY package.json bun.lock* ./
COPY tsconfig.json ./
COPY packages/types/package.json packages/types/tsconfig.json ./packages/types/
COPY packages/types/src ./packages/types/src
COPY packages/backend/package.json ./packages/backend/
# Don't copy frontend/package - create empty package.json to satisfy workspace
RUN mkdir -p packages/frontend packages/package && \
    echo '{"name":"@opencomments/frontend","private":true}' > packages/frontend/package.json && \
    echo '{"name":"@opencomments/package","private":true}' > packages/package/package.json
# Install dependencies (will skip frontend/package since they have no deps)
RUN bun install --no-save
# Build types package
RUN cd packages/types && bun run build

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/types ./packages/types
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock* ./
COPY --from=deps /app/tsconfig.json ./tsconfig.json
COPY packages/backend ./packages/backend

# Production stage
FROM base AS runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/backend ./packages/backend
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock* ./

WORKDIR /app/packages/backend

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:8080/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["bun", "run", "index.ts"]
