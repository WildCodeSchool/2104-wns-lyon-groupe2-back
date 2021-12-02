FROM node:latest

EXPOSE 4000

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm i
COPY . .
# COPY ./.env .env

CMD ["npm", "start"]
