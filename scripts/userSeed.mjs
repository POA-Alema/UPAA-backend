import { PrismaClient } from '@prisma/client';
import { scrypt as nodeScrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(nodeScrypt);

// DEV ONLY: altere estas variáveis quando precisar criar/atualizar outro usuário.
const CONFIG = {
  databaseUrl: 'mongodb://localhost:27017/porto_alegre_alema?directConnection=true',
  user: {
    id: '000000000000000000000000',
    name: 'Administrador Principal',
    email: 'admin@poaalema.com',
    password: 'admin123',
    role: 'ADMIN',
  },
};

const VALID_ROLES = ['ADMIN', 'CONTENT_MANAGER'];

function maskDatabaseUrl(databaseUrl) {
  return databaseUrl.replace(/\/\/([^:/?#]+):([^@/?#]+)@/, '//$1:***@');
}

async function hashPassword(password) {
  const salt = `dev-user-seed-${Date.now().toString(36)}`;
  const derivedKey = await scrypt(password, salt, 64);

  return `scrypt:${salt}:${Buffer.from(derivedKey).toString('hex')}`;
}

function validateConfig() {
  if (!CONFIG.databaseUrl) {
    throw new Error('CONFIG.databaseUrl é obrigatório.');
  }

  if (!CONFIG.user.name || !CONFIG.user.email || !CONFIG.user.password) {
    throw new Error('CONFIG.user precisa de name, email e password.');
  }

  if (!VALID_ROLES.includes(CONFIG.user.role)) {
    throw new Error(`Role inválida: ${CONFIG.user.role}`);
  }
}

async function findExistingUser(prisma) {
  const whereClauses = [{ email: CONFIG.user.email.toLowerCase() }];

  if (CONFIG.user.id) {
    whereClauses.push({ id: CONFIG.user.id });
  }

  const matches = await prisma.adminUser.findMany({
    where: { OR: whereClauses },
    select: { id: true, email: true },
  });

  const uniqueIds = new Set(matches.map((user) => user.id));
  if (uniqueIds.size > 1) {
    throw new Error(
      `Conflito: já existe um usuário com e-mail ${CONFIG.user.email} e outro com ID ${CONFIG.user.id}. Resolva manualmente antes de rodar o seed.`,
    );
  }

  return matches[0] ?? null;
}

async function upsertUser(prisma) {
  const existingUser = await findExistingUser(prisma);
  const data = {
    name: CONFIG.user.name.trim(),
    email: CONFIG.user.email.trim().toLowerCase(),
    passwordHash: await hashPassword(CONFIG.user.password),
    role: CONFIG.user.role,
  };
  const select = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  if (existingUser) {
    return {
      action: 'updated',
      user: await prisma.adminUser.update({
        where: { id: existingUser.id },
        data,
        select,
      }),
    };
  }

  return {
    action: 'created',
    user: await prisma.adminUser.create({
      data: {
        ...(CONFIG.user.id ? { id: CONFIG.user.id } : {}),
        ...data,
      },
      select,
    }),
  };
}

async function main() {
  validateConfig();
  process.env.DATABASE_URL = CONFIG.databaseUrl;

  const prisma = new PrismaClient();

  try {
    const result = await upsertUser(prisma);
    console.log(`Banco: ${maskDatabaseUrl(CONFIG.databaseUrl)}`);
    console.log(`Usuário ${result.action === 'created' ? 'criado' : 'atualizado'} com sucesso:`);
    console.log(JSON.stringify(result.user, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(`Erro ao rodar seed:user: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
