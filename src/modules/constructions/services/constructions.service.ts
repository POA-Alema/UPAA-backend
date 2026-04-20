import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';

@Injectable()
export class ConstructionsService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.building.findMany();
    }

    create(data: CreateConstructionDto) {
        void data;

        throw new NotImplementedException(
            'O POST /constructions ainda nao esta alinhado ao model Building do Prisma.'
        );
    }
}