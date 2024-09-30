FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the Hardhat configuration file
COPY hardhat.config.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the contracts
RUN npx hardhat compile

# Set the default command to start the application
CMD ["npm", "start"]