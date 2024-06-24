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
FROM node:22.3@sha256:b98ec1c96103fbe1a9e449b3854bbc0a0ed1c5936882ae0939d4c3a771265b4b as build

LABEL maintainer="Justin Joseph jjoseph77@myseneca.ca"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production

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

# # Install node dependencies defined in package-lock.json
RUN npm ci --only=production

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

########################################################################

FROM node:22.3-alpine3.19@sha256:9af472b2578996eb3d6affbcb82fdee6f086da2c43121e75038a4a70317f784f AS production

# We default to use port 8080 in our service
ENV PORT=8080

COPY --from=build /app /app

WORKDIR /app

# Run the server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
