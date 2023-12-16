FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install --only=production

CMD ["npm", "start"]