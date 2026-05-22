import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Verifica o status da aplicação e do banco de dados' })
  async check() {
    const status = { status: 'ok', timestamp: new Date().toISOString(), database: 'ok' };

    try {
      await this.prisma.$runCommandRaw({ ping: 1 });
    } catch {
      status.status = 'degraded';
      status.database = 'unavailable';
    }

    return status;
  }
}
