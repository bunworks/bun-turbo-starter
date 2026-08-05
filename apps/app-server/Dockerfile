FROM node:24-alpine AS base
RUN npm install -g bun@1.3.14

FROM base AS builder
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Install turbo globally
RUN npm install -g turbo@2.10.8
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN turbo prune @acme/app-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock .
RUN bun install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
ENV CI=true
RUN bun turbo run build --filter=@acme/app-server

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser

USER bunuser

# Copy built application
COPY --from=installer --chown=bunuser:nodejs /app/apps/app-server/dist ./dist
COPY --from=installer --chown=bunuser:nodejs /app/apps/app-server/package.json ./package.json
COPY --from=installer --chown=bunuser:nodejs /app/node_modules ./node_modules

# Expose port
EXPOSE 7000

# Use bun to run the server
CMD ["bun", "run", "start"]
