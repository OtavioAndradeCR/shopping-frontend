# Etapa de build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa de produção
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
