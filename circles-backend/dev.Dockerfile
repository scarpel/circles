FROM node:18

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
