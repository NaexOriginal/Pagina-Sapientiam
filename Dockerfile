# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY apps/frontend/package.json apps/frontend/bun.lock ./

# Install dependencies
RUN bun install

# Copy source
COPY apps/frontend/ .

# Build
RUN bun run build

# Runtime stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
