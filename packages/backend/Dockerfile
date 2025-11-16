# Use the official AWS Lambda adapter image to handle the Lambda runtime
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 AS aws-lambda-adapter

# Use the official Bun image to run the application
FROM oven/bun:debian AS base
WORKDIR /var/task

# Install dependencies stage
FROM base AS deps
# Copy root package files for workspace setup
COPY package.json bun.lock* ./
COPY tsconfig.json ./
# Copy types package files
COPY packages/types/package.json packages/types/tsconfig.json ./packages/types/
COPY packages/types/src ./packages/types/src
# Copy backend package.json
COPY packages/backend/package.json ./packages/backend/
# Install dependencies from root (this will handle workspace dependencies)
RUN bun install
# Build types package (postinstall should do this, but ensure it's built)
RUN cd packages/types && bun run build

# Build stage
FROM base AS builder
# Copy node_modules and built types from deps stage
COPY --from=deps /var/task/node_modules ./node_modules
COPY --from=deps /var/task/packages/types ./packages/types
# Copy root files needed for workspace
COPY --from=deps /var/task/package.json ./package.json
COPY --from=deps /var/task/bun.lock* ./
COPY --from=deps /var/task/tsconfig.json ./tsconfig.json
# Copy backend source files
COPY packages/backend ./packages/backend

# Production stage
FROM base AS runner
# Copy Lambda adapter
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter

# Copy node_modules and packages from builder
COPY --from=builder /var/task/node_modules ./node_modules
COPY --from=builder /var/task/packages/types ./packages/types
COPY --from=builder /var/task/packages/backend ./packages/backend
COPY --from=builder /var/task/tsconfig.json ./tsconfig.json
COPY --from=builder /var/task/package.json ./package.json
COPY --from=builder /var/task/bun.lock* ./

# Set working directory to backend
WORKDIR /var/task/packages/backend

# Set the port to 8080. This is required for the AWS Lambda adapter.
ENV PORT=8080
ENV NODE_ENV=production

# Run the application
CMD ["bun", "run", "index.ts"]
