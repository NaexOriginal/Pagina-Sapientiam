# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/frontend/package.json apps/frontend/bun.lock ./

# Install dependencies
RUN npm ci

# Copy source
COPY apps/frontend/ .

# Build
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
