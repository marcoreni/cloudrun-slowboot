FROM node:14.15.4-alpine AS build-env

ENV NODE_ENV=production

ADD . /app
WORKDIR /app

RUN yarn install

FROM gcr.io/distroless/nodejs
COPY --from=build-env /app /app
WORKDIR /app
CMD ["index.js"]