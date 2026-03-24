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

1.  **Instalar dependências**:
    ```bash
    npm install
    ```

2.  **Subir o banco de dados**: (ainda em andamento)!
    ```bash
    docker-compose up -d mongo
    ```

3.  **Configurar o Prisma**: (futuramente tbm) 
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Rodar a aplicação**:
    ```bash
    npm run start:dev
    ```

5.  **Acessar a Documentação (Swagger)**:
    *   URL: `http://localhost:3001/api`

