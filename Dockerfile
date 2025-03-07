FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build app/dist/connect-u-frontend/ /app

EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]
