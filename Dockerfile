# =========================
# Base
# =========================
FROM node:20.18.1-alpine AS base

WORKDIR /app
ENV TZ=America/Sao_Paulo

# =========================
# Dependencies
# =========================
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Builder (CRÍTICO)
# =========================
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 👉 Aqui o Next lê a env e embute no JS
RUN npm run build

# =========================
# Runner (produção)
# =========================
FROM node:20.18.1-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ=America/Sao_Paulo

# Usuário não-root
RUN addgroup -S nodejs -g 1001 \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
