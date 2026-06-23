import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DEFAULT_JWT_SECRET } from '../constants/auth.constants';
import { normalizeAdminRole } from '../constants/admin-role';
import { AuthenticatedAdmin, JwtPayload } from '../types/authenticated-admin';
import { PrismaService } from '../../../prisma/prisma.service';

type RequestWithAdmin = Request & {
  user?: AuthenticatedAdmin;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET') ?? DEFAULT_JWT_SECRET,
      });
      const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });

      if (!admin) {
        throw new UnauthorizedException('Usuário autenticado não encontrado.');
      }

      request.user = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: normalizeAdminRole(admin.role),
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token de autenticação inválido.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
