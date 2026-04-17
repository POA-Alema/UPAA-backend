import { Module } from '@nestjs/common';
import { ConstructionsController } from './controllers/constructions.controller';
import { EdificacaoController } from './controllers/edificacao.controller';
import { ConstructionsService } from './services/constructions.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ConstructionsController, EdificacaoController],
  providers: [ConstructionsService, PrismaService],
})
export class ConstructionsModule {}
