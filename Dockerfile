FROM node:15 as build-node15-img
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]

USER eliasjunior
RUN npm install --production
COPY . . 
EXPOSE 8080
ENTRYPOINT [ "npm", "run", "debugP" ]