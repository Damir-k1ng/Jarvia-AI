FROM node:20-alpine

WORKDIR /app

# Копировать package files
COPY package*.json ./

# Установить зависимости
RUN npm ci --only=production

# Копировать исходники
COPY . .

# Собрать TypeScript
RUN npm run build

# Запустить
CMD ["npm", "start"]

EXPOSE 3001
