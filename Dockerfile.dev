FROM node:14.16.0

EXPOSE 4000

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm i
COPY . .
# COPY ./.env .env

CMD ["npm", "start"]
