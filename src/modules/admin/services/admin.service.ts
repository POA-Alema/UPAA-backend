import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminUser, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { normalizeAdminRole } from '../../auth/constants/admin-role';
import {
  AuthenticatedAdmin,
  PublicAdminUser,
} from '../../auth/types/authenticated-admin';
import { hashPassword } from '../../auth/utils/password';
import { CreateAdminUserDto } from '../dto/create-admin-user.dto';
import { UpdateAdminUserDto } from '../dto/update-admin-user.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PublicAdminUser[]> {
    const users = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: string): Promise<PublicAdminUser> {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Administrador não encontrado.');
    }

    return this.toPublicUser(user);
  }

  async create(dto: CreateAdminUserDto): Promise<PublicAdminUser> {
    try {
      const user = await this.prisma.adminUser.create({
        data: {
          name: dto.name.trim(),
          email: this.normalizeEmail(dto.email),
          passwordHash: await hashPassword(dto.password),
          role: dto.role,
        },
      });

      return this.toPublicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado.');
      }

      throw error;
    }
  }

  async update(
    id: string,
    dto: UpdateAdminUserDto,
    currentAdmin: AuthenticatedAdmin,
  ): Promise<PublicAdminUser> {
    await this.findOne(id);

    if (dto.role && id === currentAdmin.id && dto.role !== currentAdmin.role) {
      throw new BadRequestException('Não é possível alterar a própria role.');
    }

    const data: Prisma.AdminUserUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.email !== undefined) data.email = this.normalizeEmail(dto.email);
    if (dto.password !== undefined) data.passwordHash = await hashPassword(dto.password);
    if (dto.role !== undefined) data.role = dto.role;

    try {
      const user = await this.prisma.adminUser.update({
        where: { id },
        data,
      });

      return this.toPublicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado.');
      }

      throw error;
    }
  }

  async remove(id: string, currentAdmin: AuthenticatedAdmin): Promise<PublicAdminUser> {
    if (id === currentAdmin.id) {
      throw new BadRequestException('Não é possível remover o próprio usuário.');
    }

    await this.findOne(id);

    const user = await this.prisma.adminUser.delete({ where: { id } });

    return this.toPublicUser(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private toPublicUser(user: AdminUser): PublicAdminUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizeAdminRole(user.role),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
