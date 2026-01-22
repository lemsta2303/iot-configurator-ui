# Builder
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

ENV NODE_ENV='production'

# Copy source code and build
COPY . .
RUN npm run build

# Runner
FROM caddy:alpine

# Copy built webapp
COPY --from=build /app/dist /usr/share/caddy

# Copy caddyfile config
COPY Caddyfile /etc/caddy/Caddyfile

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
