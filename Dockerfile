FROM node:12-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app/
EXPOSE 3001

# node_modules are required by the backend since its build does not include dependencies
COPY ./node_modules /usr/src/app/node_modules
COPY ./backend/build /usr/src/app
COPY ./frontend/build /usr/src/app/frontend

CMD node index.js
