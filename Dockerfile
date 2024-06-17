# # API Server - Fragments

# ## Introduction

# This is a node based REST API created using express. Following are the instructions on how to run the various scripts :

# ## Running Scripts

# To run the server manually: `node src/server.js`

# To run ESlint: `npm run lint`

# To start server using npm : `npm start`

# To run dev script specified in package.json: `npm run dev`

# To run the debug script (The debug script allows you to connect a debugger): `npm run debug`



# Use node version 18.13.0
FROM node:21.6.1

LABEL maintainer="Justin Joseph jjoseph77@myseneca.ca"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
CMD npm start
