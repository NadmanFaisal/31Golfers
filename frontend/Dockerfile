FROM node:18-slim

WORKDIR /app
COPY . /app
RUN chown -R node:node /app
RUN npm install
USER node

EXPOSE 8000
CMD ["npx", "expo", "start"]
