# Use the official Node.js image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application's port
EXPOSE 3000

# Install TypeScript globally
RUN npm install -g ts-node typescript

# Command to run the application with nodemon and ts-node
CMD ["npm", "start"]