import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param 
} from '@nestjs/common';

import { UpdateConstructionDto } from '../dto/update-construction.dto';
import { RemoveImagesDto } from '../dto/remove-images.dto';import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    return this.prisma.construction.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateConstructionDto) {
    return this.prisma.construction.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.construction.delete({
      where: { id },
    });
  }

  async removeImages(id: string, dto: RemoveImagesDto) {
    const construction = await this.findOne(id);

    const currentImages = construction[dto.category] || [];

    const updatedImages = currentImages.filter(
      (img) => !dto.images.includes(img)
    );

    return this.prisma.construction.update({
      where: { id },
      data: {
        [dto.category]: updatedImages,
      },
    });
  }
}