FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8800

CMD ["node", "app.js"]