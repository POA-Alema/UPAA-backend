import { Module } from '@nestjs/common';
import { LandingPageController } from './controllers/landing-page.controller';
import { LandingPageService } from './services/landing-page.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
controllers: [LandingPageController],
providers: [LandingPageService, PrismaService],
})
export class LandingPageModule {}