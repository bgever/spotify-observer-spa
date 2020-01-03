###
### BASE
###
FROM node:12-alpine as base

COPY wait-for /bin
RUN chmod +x /bin/wait-for

WORKDIR /app

COPY package*.json ./
RUN npm install

###
### DEV
###
FROM base as dev

# Expects the host context folder to be mounted at /app.

EXPOSE 1234
# HMR Port.
EXPOSE 12345

CMD ["npm", "start"]

###
### PROD
###
FROM base as prod

COPY . .

RUN npm run build

#CMD ["npm", "run", "build"]
# TODO: Serve
