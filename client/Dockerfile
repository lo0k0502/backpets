FROM node:16

WORKDIR /client

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

CMD ["yarn", "start"]
