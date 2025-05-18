FROM node:18

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:prod"]
