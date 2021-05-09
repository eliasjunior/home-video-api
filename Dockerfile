FROM node:18.12.1

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . . 

ENTRYPOINT [ "npm", "run", "debugP" ]