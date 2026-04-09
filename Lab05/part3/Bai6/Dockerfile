FROM node:18-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

FROM base AS dev
CMD ["npm", "start"]

FROM base AS test
CMD ["npm", "test", "--", "--watchAll"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
