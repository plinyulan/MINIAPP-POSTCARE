FROM node:20-alpine

WORKDIR /app

COPY Frontend/Postcare/package*.json ./
RUN npm install

COPY Frontend/Postcare/ ./

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]