import { Module } from '@nestjs/common';
import { BiographyController } from './controllers/biography.controller';
import { BiographyService } from './services/biography.service';

@Module({
  controllers: [BiographyController],
  providers: [BiographyService],
})
export class BiographyModule {}