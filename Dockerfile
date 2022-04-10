FROM node:16-alpine AS BUILD
WORKDIR /build
COPY . /build
RUN rm -r Procfile LICENSE README.md
RUN npm install --production

FROM node:16-alpine
LABEL MAINTAINER="Nizeic" DESCRIPTION="A music bot written using discord.js and discord-player"
WORKDIR /bot
COPY --from=BUILD /usr/lib/ /usr/lib/
COPY --from=BUILD /lib/ /lib/
COPY --from=BUILD /build/ /bot
ENV NODE_ENV production
CMD ["node", "./index.js"]
