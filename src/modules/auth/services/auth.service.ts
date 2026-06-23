import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminUser, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { DEFAULT_JWT_SECRET, JWT_EXPIRES_IN } from '../constants/auth.constants';
import { normalizeAdminRole } from '../constants/admin-role';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { PublicAdminUser } from '../types/authenticated-admin';
import { hashPassword, verifyPassword } from '../utils/password';

type AuthResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: string;
  user: PublicAdminUser;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<PublicAdminUser> {
    const email = this.normalizeEmail(registerDto.email);

    try {
      const user = await this.prisma.adminUser.create({
        data: {
          name: registerDto.name.trim(),
          email,
          passwordHash: await hashPassword(registerDto.password),
          role: registerDto.role,
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

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(loginDto.email);
    const user = await this.prisma.adminUser.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.buildAuthResponse(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async buildAuthResponse(user: AdminUser): Promise<AuthResponse> {
    const role = normalizeAdminRole(user.role);
    const payload = {
      sub: user.id,
      email: user.email,
      role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET') ?? DEFAULT_JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: JWT_EXPIRES_IN,
      user: this.toPublicUser(user),
    };
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
