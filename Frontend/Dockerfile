# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build for production
ENV NODE_ENV=production
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine

# Copy built static files to Nginx default html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
