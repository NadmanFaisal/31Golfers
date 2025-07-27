FROM node:20-alpine

WORKDIR /app
COPY . /app
RUN chown -R node:node /app
RUN npm install
USER node

EXPOSE 8000
CMD ["npx", "expo", "start"]