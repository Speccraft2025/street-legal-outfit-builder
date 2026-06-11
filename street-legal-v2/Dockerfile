# Base image
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# For turbo workspaces
RUN npm install
RUN npx turbo run build --filter=web

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Next.js standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV PORT 3000

CMD ["node", "apps/web/server.js"]
