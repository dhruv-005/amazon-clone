# Base Node.js image
FROM node:20-alpine AS base

# Working directory
WORKDIR /app

# Install system dependencies for Puppeteer / Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose API port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start command
CMD ["node", "src/server.js"]
