
FROM node:14

# Set the working dir
WORKDIR /app/backend


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
