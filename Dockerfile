FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port 3005
EXPOSE 3005

# Start the app using the PORT environment variable
CMD ["sh", "-c", "npm run preview -- --port $PORT"]