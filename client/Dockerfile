FROM node:alpine

WORKDIR /app

ENV NODE_ENV production

COPY .next/standalone ./
COPY .next/static ./.next/static

ENV PORT 80
EXPOSE 80

CMD ["node", "server.js"]