# =====================
# --- Builder Stage ---
# =====================
FROM node:22 AS builder

RUN mkdir -p /build
WORKDIR /build

COPY client ./

RUN npm install
RUN npm run build

# ===================
# --- Final Image ---
# ===================
FROM node:22
LABEL maintainer="IETF Tools Team <tools-discuss@ietf.org>"

RUN mkdir -p /app && \
    chown node:node /app
WORKDIR /app

COPY --from=builder /build/.output ./

USER node:node
CMD node server/index.mjs