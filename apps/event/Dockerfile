FROM node:18

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start:prod"]
