# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl1.1-compat

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci for more flexibility)
RUN npm install --only=production && npm cache clean --force

# Copy Prisma schema first (for generating client)
COPY prisma ./prisma

# Generate Prisma client with correct engine
RUN npx prisma generate

# Copy application source code
COPY . .

# Create uploads directory structure
RUN mkdir -p uploads/avatars uploads/proofs

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Change ownership of app directory to nodeuser
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 