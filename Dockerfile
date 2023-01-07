FROM node:15

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

USER eliasjunior

RUN npm install --production

COPY . . 

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "debugP" ]