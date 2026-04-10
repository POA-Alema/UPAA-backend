import { Module } from '@nestjs/common';
import { ConstructionsModule } from './modules/constructions/constructions.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { BiographyModule } from './modules/biography/biography.module';


@Module({
  imports: [ConstructionsModule, AdminModule, AuthModule, BiographyModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
