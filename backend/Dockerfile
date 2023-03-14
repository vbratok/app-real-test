# Base image
FROM node:16-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build



# # Runtime (production) layer
# FROM node:16-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# # Create app directory
# WORKDIR /usr/src/app

# # Copy dependencies files
# COPY package*.json ./

# # Create app directory
# RUN npm install --only=production

# # Copy production build
# COPY --from=development /usr/src/app/dist ./dist
# #COPY . .

# # Expose application port
# EXPOSE 3001

# # Start application
# CMD [ "node", "dist/main.js" ]
