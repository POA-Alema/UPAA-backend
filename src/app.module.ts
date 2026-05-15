import { Module } from '@nestjs/common';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { LandingPageModule } from './modules/landingPage/landing-page.module';

@Module({
  imports: [BuildingsModule, AdminModule, AuthModule, LandingPageModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
