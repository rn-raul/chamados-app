FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# Produção
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 8093
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8093"]