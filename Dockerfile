# Stage 1: Dependencies
# We use a separate stage for dependencies to keep the final image size small
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
# This stage compiles and builds our application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment variables
# These will be overridden by runtime values in DigitalOcean
ENV NODE_ENV production
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
ENV VITE_GOOGLE_ADS_CONVERSION_IDS=${VITE_GOOGLE_ADS_CONVERSION_IDS}

# Build the application
RUN npm run build

# Stage 3: Production Runner
# This stage creates our final, minimal production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install production dependencies and security updates
RUN apk add --no-cache tini curl && \
    apk upgrade --no-cache

# Copy only the necessary built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Create and use non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app
USER nodejs

# Set runtime environment
ENV PORT 8080
ENV NODE_ENV production

# Use tini as init system for proper process management
ENTRYPOINT ["/sbin/tini", "--"]

# Set up health check to monitor application status
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Command to run the application
CMD ["npm", "start"]

# Label the image with metadata
LABEL maintainer="Allervie Dashboard Team" \
      version="1.0.0" \
      description="Lead generation dashboard for Allervie" \
      org.opencontainers.image.source="https://github.com/jhillbht/allervie-dashboard"

# Expose port
EXPOSE ${PORT}