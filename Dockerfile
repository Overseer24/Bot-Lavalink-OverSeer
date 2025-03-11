# Use an official Node.js runtime as a parent image
FROM node:latest


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .


# Expose necessary ports (if needed)
EXPOSE 3000

# Command to start the bot
CMD ["node", "index.js"]
