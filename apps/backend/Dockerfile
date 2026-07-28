FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN corepack enable

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter backend build
RUN pnpm --filter backend --prod deploy /prod/backend

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/backend ./
COPY --from=build /usr/src/app/apps/backend/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
