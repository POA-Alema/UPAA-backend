## Tecnologias Principais

*   **Linguagem**: TypeScript
*   **Framework**: NestJS
*   **Banco de Dados**: MongoDB 
*   **ORM**: Prisma

## Estrutura de Pastas

A estrutura segue o padrão modular do NestJS, facilitando a manutenção e testes.

```
backend/
├── src/
│   ├── modules/
│   │   ├── constructions/ # Módulo de Construções (Obras)
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   └── admin/       # Módulo Administrativo (dashboard e painel administrativo)
|   |   └── auth/        # Módulo de Autenticação 
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── dto/
│   │       └── repository/
|   |   
│   ├── prisma/          # Serviço de conexão com o banco
│   ├── app.module.ts    # Módulo raiz
│   └── main.ts          # Ponto de entrada
├── prisma/
│   └── schema.prisma    # Esquema do banco de dados
├── docker-compose.yml   # Configuração do ambiente (DB + App)
└── package.json
```

## Configuração Inicial


# 0. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
# Conexão com o banco de dados MongoDB
DATABASE_URL="mongodb://url?replicaSet=rs0&directConnection=true"
```

Pegue a url completa no canal Backend no discord

# 1.  **Instalar dependências**:
```
bash npm install
```
**PRIORIZE RODAR A APLICAÇÃO NO DOCKER:**

# 2.  **Subir o banco de dados**: 

### Subir apenas o MongoDB
```bash
docker compose up -d mongo
```

### Verificar se o container está rodando
```bash

docker compose ps
```

### Visualizar logs do MongoDB
```bash
docker compose logs mongo
```

### Acessar o MongoDB diretamente

```bash
docker compose exec mongo mongosh
```

O seed com dados iniciais será executado automaticamente na primeira inicialização.

# 3. Configurar o Prisma

Gerar o Prisma Client
```bash
npx prisma generate
```


### Sincronizar o schema com o banco de dados
```bash
npx prisma db push
```

### Visualizar dados no Prisma Studio (opcional)
```bash
npx prisma studio
```

## 4. Rodar a aplicação

```bash
npm run start:dev
```


# 5. Acessar a Documentação (Swagger)

- Swagger UI: http://localhost:3001/api

- Prisma Studio: http://localhost:5555



##  Comandos Docker Úteis

| Comando | Descrição |
|---------|-----------|
| `docker compose up -d mongo` | Iniciar MongoDB em segundo plano |
| `docker compose up -d` | Iniciar MongoDB + Backend |
| `docker compose down` | Parar os containers |
| `docker compose down -v` | Parar e remover volumes (apaga os dados) |
| `docker compose ps` | Ver status dos containers |
| `docker compose logs mongo -f` | Ver logs do MongoDB em tempo real |
| `docker compose exec mongo mongosh` | Acessar shell interativo do MongoDB |
| `docker compose exec mongo mongosh --eval "show dbs"` | Executar comando no MongoDB |
| `docker compose exec mongo mongosh /docker-entrypoint-initdb.d/seed.js` | Executar seed manualmente |

##  Comandos do Prisma

| Comando | Descrição |
|---------|-----------|
| `npx prisma generate` | Gerar Prisma Client |
| `npx prisma db push` | Sincronizar schema com o banco |
| `npx prisma studio` | Abrir interface gráfica para visualizar dados |
| `npx prisma db push --force-reset` | Resetar o banco (cuidado!) |

## Debug no VS Code ou IDEs compatÃ­veis

Foi adicionada a configuraÃ§Ã£o [.vscode/launch.json](./.vscode/launch.json) para debug do backend.

1. Abra a aba **Run and Debug**
2. Selecione `NestJS: Debug (start:debug)`
3. Inicie com `F5`

Essa configuraÃ§Ã£o executa `npm run start:debug`, expÃµe o inspector do Node na porta `9229` e usa source maps para depurar os arquivos TypeScript.

Se a aplicaÃ§Ã£o jÃ¡ estiver em execuÃ§Ã£o em modo debug, use a configuraÃ§Ã£o `Node: Attach (porta 9229)`.

## Helpers

Validade Typescript compile
`npx tsc --noEmit 2>&1`