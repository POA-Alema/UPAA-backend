import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArchitectsModule } from './modules/architects/architects.module';
import { LandingPageModule } from './modules/landingPage/landing-page.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdminModule, AuthModule, ArchitectsModule, LandingPageModule, BuildingsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
