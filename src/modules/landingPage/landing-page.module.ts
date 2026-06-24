import { Module } from '@nestjs/common';
import { LandingPageController } from './controllers/landing-page.controller';
import { LandingPageService } from './services/landing-page.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LandingPageController],
  providers: [LandingPageService, PrismaService],
  exports: [LandingPageService],
})
export class LandingPageModule {}
