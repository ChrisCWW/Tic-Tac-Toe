FROM node:18-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:18 AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app .

ARG PORT
ENV SERVER_PORT=${PORT}
EXPOSE ${PORT}

CMD ["npm", "start"]