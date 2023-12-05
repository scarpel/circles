FROM node:18

WORKDIR /client

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]