FROM node:latest

# Create working directory
WORKDIR /usr/src/app

# Copy both package.json and package-lock.json for dependencies
COPY package*.json ./

# Install npm packages for production
RUN npm install --only=production

# Bundle app source
COPY . /usr/src/app

# Exposing port 8080
EXPOSE 8080

# Definie environment variable
ENV DEBUG 'crypto:*'

# Start command
CMD [ "npm", "start" ]