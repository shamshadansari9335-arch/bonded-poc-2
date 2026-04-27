FROM node:22-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
COPY .env .
CMD ["node", "server.js"]