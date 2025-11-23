# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache libc6-compat \
  && npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist /app/dist
ENV PORT=3434
ENV NODE_ENV=production
EXPOSE 3434
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
