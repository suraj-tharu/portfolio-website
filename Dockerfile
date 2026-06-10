FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build CSS and JS
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
