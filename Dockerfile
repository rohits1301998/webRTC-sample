FROM hoosin/alpine-nginx-nodejs:latest

WORKDIR /webrtc

RUN apk add yarn
COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server/
COPY ./server/dist/ ./server/
RUN cd ./server && yarn

COPY ./web/build/ ./web/


EXPOSE 7000
CMD ["node", "./server/src/ws.js"]

