FROM node:16-alpine AS build

# Defining the work directory
WORKDIR /app

# We're in a development environment
ENV NODE_ENV=development

# Copying package files and install dependencies
COPY package*.json ./
RUN ["npm", "install"]

# Copying all other files
COPY . .

# Creating a build output
RUN ["npm", "run", "build"]


FROM node:16-alpine

# Defining the work directory
WORKDIR /app

# We're in a production environment
ENV NODE_ENV=production

# Copying package files and install dependencies
COPY package*.json ./
RUN ["npm", "install"]

# Copy build output and configurations
COPY --from=build /app/dist ./dist
COPY .env .

# Defining the entry command
CMD ["npm", "run", "start:prod"]
