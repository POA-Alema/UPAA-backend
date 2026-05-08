import { Module } from '@nestjs/common';
import { ConstructionsController } from './controllers/constructions.controller';
import { ConstructionsService } from './services/constructions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArchitectsController } from '../architects/controllers/architects.controller';
import { ArchitectsService } from '../architects/services/architects.service';

@Module({
  controllers: [ConstructionsController, ArchitectsController],
  providers: [ConstructionsService, ArchitectsService, PrismaService],
})
export class ConstructionsModule {}
