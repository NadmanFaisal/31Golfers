FROM node:20-alpine

WORKDIR /app
COPY . /app
RUN chown -R node:node /app
RUN npm install

USER node

EXPOSE 3000
CMD ["node", "app.js"]