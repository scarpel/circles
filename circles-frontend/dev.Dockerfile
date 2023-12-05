FROM node:18

WORKDIR /client

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]