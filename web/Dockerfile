FROM node:16

WORKDIR /web

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
