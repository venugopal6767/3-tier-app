# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --silent

# copy source code
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# clean default nginx files
RUN rm -rf ./*

# copy build output from React
COPY --from=build /app/dist .

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
