FROM node:18-alpine

WORKDIR /app

ENV PNPM_HOME="/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --no-frozen-lockfile --shamefully-hoist

COPY . .

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "./src/app.js"]
