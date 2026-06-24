import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { scryptSync } from 'crypto';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminRole } from '../constants/admin-role';

const now = new Date('2026-01-01T00:00:00.000Z');

const mockAdminUser = {
  id: '000000000000000000000001',
  name: 'Admin Teste',
  email: 'admin@poaalema.com',
  passwordHash: hashPassword('admin123'),
  role: AdminRole.ADMIN,
  createdAt: now,
  updatedAt: now,
};

function hashPassword(password: string, salt = 'test-salt'): string {
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

const mockPrismaService = {
  adminUser: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.signAsync.mockResolvedValue('signed-token');
    mockConfigService.get.mockReturnValue('jwt-secret');
  });

  describe('register()', () => {
    it('cadastra admin com e-mail normalizado e senha hasheada', async () => {
      mockPrismaService.adminUser.create.mockImplementation(({ data }) => ({
        ...mockAdminUser,
        ...data,
        id: mockAdminUser.id,
        createdAt: now,
        updatedAt: now,
      }));

      const result = await service.register({
        name: ' Admin Teste ',
        email: 'ADMIN@POAALEMA.COM',
        password: 'admin123',
        role: AdminRole.CONTENT_MANAGER,
      });

      expect(mockPrismaService.adminUser.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Admin Teste',
          email: 'admin@poaalema.com',
          role: AdminRole.CONTENT_MANAGER,
        }),
      });
      expect(mockPrismaService.adminUser.create.mock.calls[0][0].data.passwordHash).toMatch(/^scrypt:/);
      expect(mockPrismaService.adminUser.create.mock.calls[0][0].data.passwordHash).not.toBe('admin123');
      expect(result).toEqual({
        id: mockAdminUser.id,
        name: 'Admin Teste',
        email: 'admin@poaalema.com',
        role: AdminRole.CONTENT_MANAGER,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('lança ConflictException quando o e-mail já existe', async () => {
      mockPrismaService.adminUser.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '5.0.0',
        }),
      );

      await expect(
        service.register({
          name: 'Admin Teste',
          email: 'admin@poaalema.com',
          password: 'admin123',
          role: AdminRole.CONTENT_MANAGER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('autentica com credenciais válidas', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);

      const result = await service.login({
        email: 'ADMIN@POAALEMA.COM',
        password: 'admin123',
      });

      expect(mockPrismaService.adminUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@poaalema.com' },
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockAdminUser.id,
          email: mockAdminUser.email,
          role: AdminRole.ADMIN,
        },
        {
          secret: 'jwt-secret',
          expiresIn: '7d',
        },
      );
      expect(result.access_token).toBe('signed-token');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejeita senha incorreta', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValue(mockAdminUser);

      await expect(
        service.login({
          email: 'admin@poaalema.com',
          password: 'senha-errada',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejeita usuário inexistente', async () => {
      mockPrismaService.adminUser.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'admin@poaalema.com',
          password: 'admin123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
