FROM node:24-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD [ "npm", "run", "serve" ]