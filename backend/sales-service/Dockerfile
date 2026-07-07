FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL


RUN npx prisma generate

RUN npm run build

EXPOSE 3003

CMD ["npm","run","start:prod"]