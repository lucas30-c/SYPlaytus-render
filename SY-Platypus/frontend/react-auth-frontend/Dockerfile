
FROM node:14

WORKDIR /app/frontend


COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
