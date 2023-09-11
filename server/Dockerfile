FROM node:20.6.1-alpine3.18
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm run build

FROM node:20.6.1-alpine3.18
WORKDIR /app
RUN npm install -g pnpm
COPY --from=0 /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
EXPOSE 3000
CMD [ "pnpm", "run", "start:prod" ]
