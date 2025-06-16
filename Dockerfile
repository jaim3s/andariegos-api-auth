# Step 1: Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 4001

# Step 8: Define the command to run the application
CMD ["sh", "-c", "npm run start:prod -- -p ${PORT}"]