###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate

###################
# BUILD FOR PRODUCTION
###################

FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV production
RUN npm prune --production

COPY --from=development /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

###################
# PRODUCTION
###################

FROM node:18 AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json ./

USER node

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

