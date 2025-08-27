# Multi-stage build for AI Coding Assistant
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development

# Install dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p projects logs temp cache

# Set permissions
RUN chown -R node:node /app
USER node

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start development server
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p projects logs temp cache

# Set permissions
RUN chown -R node:node /app
USER node

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start production server
CMD ["npm", "start"]

# Testing stage
FROM base AS testing

# Install dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p projects logs temp cache

# Set permissions
RUN chown -R node:node /app
USER node

# Run tests
CMD ["npm", "test"]

# Build stage
FROM base AS builder

# Install dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend (if exists)
RUN if [ -d "frontend" ]; then \
        cd frontend && npm ci && npm run build && cd ..; \
    fi

# Create production build
RUN npm run build:all

# Final production stage
FROM node:18-alpine AS final

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Create necessary directories
RUN mkdir -p projects logs temp cache

# Set permissions
RUN chown -R node:node /app
USER node

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start production server
CMD ["npm", "start"]