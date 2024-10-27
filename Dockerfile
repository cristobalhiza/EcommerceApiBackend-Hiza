# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.7.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

ARG PNPM_VERSION=9.12.1
RUN npm install -g pnpm@$PNPM_VERSION

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

FROM base

COPY --from=build /app /app

EXPOSE 3000

CMD [ "pnpm", "run", "start" ]
