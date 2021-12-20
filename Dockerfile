# FROM node:latest as common-build-stage
FROM node:14-alpine3.12 as common-build-stage
# FROM node:lts-alpine

WORKDIR /usr/local/app
# ADD . .
# RUN yarn set version berry 
ENV PATH /app/local/app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
COPY . ./
RUN apk add --no-cache git
RUN npm install -g serve
RUN yarn
EXPOSE 3000

FROM common-build-stage as production-build-stage
ENV NODE_ENV production
CMD ["yarn", "start:production"]