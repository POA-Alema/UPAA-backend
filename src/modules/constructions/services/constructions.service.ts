import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';

@Injectable()
export class ConstructionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.construction.findMany();
  }

  create(data: CreateConstructionDto) {
    return this.prisma.construction.create({ data });
  }
}
