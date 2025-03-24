# Stage 1: Build
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# (Optional) If you need to build any assets, run your build command here
# RUN npm run build

# Stage 2: Run in production with PM2
FROM node:18-alpine

WORKDIR /app

# Copy node_modules and source code from the build stage
COPY --from=build /app /app

# Install PM2 globally
RUN npm install -g pm2

# Expose the port used by your API server (e.g., 8080)
EXPOSE 8080

# Use PM2 runtime to run both server and worker using the ecosystem configuration
CMD ["pm2-runtime", "ecosystem.config.js"]
