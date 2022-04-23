FROM node:16 as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:16 as ts-remover
WORKDIR /app
COPY --from=ts-compiler /app/package*.json ./
COPY --from=ts-compiler /app/build ./
RUN npm install --only=production

FROM node:16

ARG GIT_COMMIT
ARG GIT_REVISION
ARG TWITTER_API_V2_BEARER_TOKEN

ENV GIT_COMMIT $GIT_COMMIT
ENV GIT_REVISION $GIT_REVISION
ENV NODE_ENV production


WORKDIR /app
RUN mkdir -p /app/cache
COPY --from=ts-remover /app ./

EXPOSE 3000

CMD ["node", "index.js"]