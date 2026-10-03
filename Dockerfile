FROM node:22-alpine AS dependencies
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/portal/package.json apps/portal/package.json
COPY apps/portal-e2e/package.json apps/portal-e2e/package.json
COPY libs/auth/client/package.json libs/auth/client/package.json
COPY libs/intake/feature/package.json libs/intake/feature/package.json
COPY libs/planning/feature/package.json libs/planning/feature/package.json
COPY libs/shared/api-client/package.json libs/shared/api-client/package.json
COPY libs/ui/components/package.json libs/ui/components/package.json
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /workspace
COPY --from=dependencies /workspace/node_modules ./node_modules
COPY . .
ENV NX_DAEMON=false
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /workspace
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    HOME=/tmp
COPY --from=build /workspace/apps/portal/.next/standalone ./
COPY --from=build /workspace/apps/portal/public ./apps/portal/public
COPY --from=build /workspace/apps/portal/.next/static ./apps/portal/.next/static
RUN mkdir -p /workspace/apps/portal/.next/cache /tmp && chgrp -R 0 /workspace /tmp && chmod -R g=u /workspace /tmp
USER 1001
EXPOSE 3000
CMD ["node", "apps/portal/server.js"]
