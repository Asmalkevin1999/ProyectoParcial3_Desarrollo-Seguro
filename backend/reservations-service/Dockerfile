# ── Etapa base ───────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependencias nativas necesarias para Prisma
RUN apk add --no-cache openssl wget

# ── Etapa dependencias ─────────────────
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ── Etapa build / final ────────────────
FROM base AS release
WORKDIR /app

# Copiar dependencias de producción
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar Prisma schema y generar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Puerto expuesto
EXPOSE 3001

# Healthcheck interno
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/stats || exit 1

# Al iniciar: aplicar migraciones y arrancar servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]