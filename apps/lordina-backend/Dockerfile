# Backend Dockerfile — used by Render Docker deployments
# Build context: repo root (so workspace packages are available)

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/lordina-backend/package.json ./apps/lordina-backend/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Build
COPY apps/lordina-backend ./apps/lordina-backend
COPY tsconfig.base.json ./
RUN pnpm --filter @mahama/lordina-backend build

# Production
FROM node:20-alpine AS prod
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json /app/.npmrc ./
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/lordina-backend/package.json ./apps/lordina-backend/
RUN pnpm install --frozen-lockfile --prod
COPY --from=base /app/apps/lordina-backend/dist ./apps/lordina-backend/dist
EXPOSE 10000
CMD ["node", "--env-file=.env", "apps/lordina-backend/dist/main.js"]
