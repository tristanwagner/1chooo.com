FROM node:20-alpine AS base

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG APP_NAME

RUN corepack enable pnpm
RUN pnpm install --global turbo@^2

FROM base AS builder
WORKDIR /app

COPY . .

# https://turbo.build/repo/docs/guides/tools/docker#the-solution
RUN turbo prune ${APP_NAME} --docker

# Rebuild the source code only when needed
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN turbo build --filter=${APP_NAME}

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/${APP_NAME}/next.config.ts .
COPY --from=installer /app/apps/${APP_NAME}/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/${APP_NAME}

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD node server.js
