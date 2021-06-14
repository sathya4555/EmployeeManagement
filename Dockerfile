FROM node: latest

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8811

CMD ["node","indexts.ts"]