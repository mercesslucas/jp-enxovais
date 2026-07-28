FROM node:20-alpine

WORKDIR /app

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Argumentos passados pelo Easypanel no momento do Build
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

# Torna os argumentos disponíveis como Variáveis de Ambiente no Build
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME

# Executa o build da aplicação Next.js
RUN npm run build

# Expõe a porta 3000 (o Easypanel mapeia isso automaticamente)
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]
