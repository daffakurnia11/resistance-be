# Stage 1: Build Stage
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Stage 2: Production Stage
FROM node:20 AS runner

WORKDIR /app

# Copy only the built files and node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose the application's port
EXPOSE 8000

# Run database migrations (optional, remove if not needed)
CMD npx prisma migrate deploy && node dist/main
