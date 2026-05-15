import { Module } from '@nestjs/common';
import { ArchitectsController } from './controllers/architects.controller';
import { ArchitectsService } from './services/architects.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ArchitectsController],
  providers: [ArchitectsService, PrismaService],
})
export class ArchitectsModule {}
