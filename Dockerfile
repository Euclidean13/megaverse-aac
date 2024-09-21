# Build
FROM node:18.14.0-alpine3.17 as build
USER root
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN apk update && apk add --no-cache
COPY src ./src
RUN npm install
RUN npm run build

# Image creation
FROM node:18.14.0-alpine3.17
USER root
WORKDIR /app
RUN apk update && apk add --no-cache
COPY package.json ./
COPY .env.production ./.env
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 5081
CMD ["npm", "run", "start"]
