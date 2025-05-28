# Use exact Node version
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the SvelteKit app
RUN npm run build

# Expose app port
EXPOSE 3000

# Start server using adapter-node build output
CMD ["node", "build"]
