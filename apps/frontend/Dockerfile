FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN corepack enable

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter frontend build
RUN pnpm --filter frontend --prod deploy /prod/frontend

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/frontend ./
COPY --from=build /usr/src/app/apps/frontend/.next ./.next
COPY --from=build /usr/src/app/apps/frontend/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
