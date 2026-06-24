import { Module } from '@nestjs/common';
import { BuildingsService } from './services/buildings.service';
import { BuildingsController } from './controllers/buildings.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from '../../Utils/S3.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BuildingsController],
  providers: [BuildingsService, PrismaService, S3Service],
})
export class BuildingsModule {}
