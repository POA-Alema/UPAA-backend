import { Module } from '@nestjs/common';
import { BuildingsService } from './services/buildings.service';
import { BuildingsController } from './controllers/buildings.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService, PrismaService],
})
export class BuildingsModule {}
