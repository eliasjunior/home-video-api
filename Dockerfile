FROM node:18-alpine as build-node18-img
# ENV NODE_ENV=${ENV}  
WORKDIR /app
COPY package*.json ./

RUN npm install --only=production
COPY . . 
EXPOSE 8080
ENTRYPOINT [ "npm", "run", "debugP"]

