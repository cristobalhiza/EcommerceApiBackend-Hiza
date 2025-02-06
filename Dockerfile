FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --shamefully-hoist

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "./src/app.js"]