# Backend Dockerfile — used by Render Docker deployments
# Build context: repo root (so workspace packages are available)

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/sharaf-backend/package.json ./apps/sharaf-backend/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Build
COPY apps/sharaf-backend ./apps/sharaf-backend
COPY tsconfig.base.json ./
RUN pnpm --filter @mahama/sharaf-backend build

# Production
FROM node:20-alpine AS prod
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json /app/.npmrc ./
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/sharaf-backend/package.json ./apps/sharaf-backend/
RUN pnpm install --frozen-lockfile --prod
COPY --from=base /app/apps/sharaf-backend/dist ./apps/sharaf-backend/dist
EXPOSE 10000
CMD ["node", "--env-file=.env", "apps/sharaf-backend/dist/main.js"]
