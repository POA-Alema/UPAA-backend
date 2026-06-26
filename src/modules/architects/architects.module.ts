import { Module } from '@nestjs/common';
import { ArchitectsController } from './controllers/architects.controller';
import { ArchitectsService } from './services/architects.service';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from '../../Utils/S3.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ArchitectsController],
  providers: [ArchitectsService, PrismaService, S3Service],
})
export class ArchitectsModule {}
