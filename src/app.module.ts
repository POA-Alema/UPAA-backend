import { Module } from '@nestjs/common';
import { ConstructionsModule } from './modules/constructions/constructions.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArchitectsModule } from './modules/architects/architects.module';
import { PrismaService } from './prisma/prisma.service';
import { LandingPageModule } from './modules/landingPage/landing-page.module';

@Module({
  imports: [ConstructionsModule, AdminModule, AuthModule, ArchitectsModule, LandingPageModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
