import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AdminService } from './admin.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminRole } from '../../auth/constants/admin-role';
import { AuthenticatedAdmin } from '../../auth/types/authenticated-admin';

const now = new Date('2026-01-01T00:00:00.000Z');

const adminUser = {
  id: '000000000000000000000001',
  name: 'Admin',
  email: 'admin@poaalema.com',
  passwordHash: 'scrypt:salt:hash',
  role: AdminRole.ADMIN,
  createdAt: now,
  updatedAt: now,
};

const contentManagerUser = {
  id: '000000000000000000000002',
  name: 'Conteúdo',
  email: 'conteudo@poaalema.com',
  passwordHash: 'scrypt:salt:hash',
  role: AdminRole.CONTENT_MANAGER,
  createdAt: now,
  updatedAt: now,
};

const currentAdmin: AuthenticatedAdmin = {
  id: adminUser.id,
  name: adminUser.name,
  email: adminUser.email,
  role: AdminRole.ADMIN,
};

const mockPrismaService = {
  adminUser: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
  });

  it('lista usuários sem passwordHash e normaliza role legada', async () => {
    mockPrismaService.adminUser.findMany.mockResolvedValue([
      adminUser,
      { ...contentManagerUser, role: 'content_manager' },
    ]);

    const result = await service.findAll();

    expect(result).toEqual([
      expect.objectContaining({ id: adminUser.id, role: AdminRole.ADMIN }),
      expect.objectContaining({ id: contentManagerUser.id, role: AdminRole.CONTENT_MANAGER }),
    ]);
    expect(result[0]).not.toHaveProperty('passwordHash');
  });

  it('cria usuário com e-mail normalizado e senha hasheada', async () => {
    mockPrismaService.adminUser.create.mockImplementation(({ data }) => ({
      ...contentManagerUser,
      ...data,
      id: contentManagerUser.id,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await service.create({
      name: ' Conteúdo ',
      email: 'CONTEUDO@POAALEMA.COM',
      password: 'admin123',
      role: AdminRole.CONTENT_MANAGER,
    });

    expect(mockPrismaService.adminUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Conteúdo',
        email: 'conteudo@poaalema.com',
        role: AdminRole.CONTENT_MANAGER,
      }),
    });
    expect(mockPrismaService.adminUser.create.mock.calls[0][0].data.passwordHash).toMatch(/^scrypt:/);
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('lança ConflictException em e-mail duplicado', async () => {
    mockPrismaService.adminUser.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
      }),
    );

    await expect(
      service.create({
        name: 'Admin',
        email: 'admin@poaalema.com',
        password: 'admin123',
        role: AdminRole.ADMIN,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('não permite alterar a própria role', async () => {
    mockPrismaService.adminUser.findUnique.mockResolvedValue(adminUser);

    await expect(
      service.update(adminUser.id, { role: AdminRole.CONTENT_MANAGER }, currentAdmin),
    ).rejects.toThrow(BadRequestException);
  });

  it('não permite remover o próprio usuário', async () => {
    await expect(service.remove(adminUser.id, currentAdmin)).rejects.toThrow(BadRequestException);
  });

  it('lança NotFoundException quando usuário não existe', async () => {
    mockPrismaService.adminUser.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
  });
});
