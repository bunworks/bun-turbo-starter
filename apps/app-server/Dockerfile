FROM node:24-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Install bun
RUN npm install -g bun@1.3.10
# Set working directory
WORKDIR /app
# Install turbo globally
RUN npm install -g turbo@2.8.15
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN turbo prune @acme/app-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
# Install bun
RUN npm install -g bun@1.3.10
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/bun.lock .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL
ENV CI=true
RUN bun turbo run build --filter=@acme/app-server

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser

# Install bun in runner stage
RUN npm install -g bun@1.3.10

USER bunuser

# Copy built application
COPY --from=installer --chown=bunuser:nodejs /app/apps/app-server/dist ./dist
COPY --from=installer --chown=bunuser:nodejs /app/apps/app-server/package.json ./package.json
COPY --from=installer --chown=bunuser:nodejs /app/node_modules ./node_modules

# Expose port
EXPOSE 7000

# Use bun to run the server
CMD ["bun", "run", "start"]
