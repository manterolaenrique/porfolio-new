FROM node:24.12.0-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 3000
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["npm", "run", "dev"]
