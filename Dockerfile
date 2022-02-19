FROM node:16.11.0-alpine

WORKDIR /app

COPY . .

ENV PREFIX=!
ENV BOTTOKEN=null
ENV GENIUSAPITOKEN=null

RUN npm install

CMD ["npm" , "start"]