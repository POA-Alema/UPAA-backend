import { Module } from '@nestjs/common';
import { ConstructionsController } from './controllers/constructions.controller';
import { ConstructionsService } from './services/constructions.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ConstructionsController],
  providers: [ConstructionsService, PrismaService],
})
export class ConstructionsModule {}
