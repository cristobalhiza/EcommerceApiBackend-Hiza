FROM node:18-alpine

WORKDIR /app

ENV PNPM_HOME="/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_PATH="/app/node_modules"

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm \
    && pnpm config set store-dir /app/pnpm-store \
    && pnpm install --no-frozen-lockfile --shamefully-hoist --strict-peer-dependencies=false

COPY . .

RUN ls -l node_modules/express

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "./src/app.js"]
