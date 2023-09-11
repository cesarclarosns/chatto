FROM node:20.6.0-alpine3.18 AS build
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist/client/ /usr/share/nginx/html
EXPOSE 80
