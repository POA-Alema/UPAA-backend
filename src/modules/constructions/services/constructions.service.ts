import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';
import { UpdateConstructionDto } from '../dto/update-construction.dto';
import { RemoveImagesDto } from '../dto/remove-images.dto';

@Injectable()
export class ConstructionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.construction.findMany();
  }

  async findOne(id: string) {
    const construction = await this.prisma.construction.findUnique({
      where: { id },
    });
    if (!construction) {
      throw new NotFoundException(`Edificação com ID ${id} não encontrada`);
    }
    return construction;
  }

  create(data: CreateConstructionDto) {
    return this.prisma.construction.create({ data: data as any });
  }

  async update(id: string, dto: UpdateConstructionDto) {
    await this.findOne(id);
    return this.prisma.construction.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.construction.delete({
      where: { id },
    });
  }

  async removeImages(id: string, dto: RemoveImagesDto) {
    const construction = await this.findOne(id);
    
    const currentImages = (construction as any)[dto.category];
    if (!Array.isArray(currentImages)) {
      throw new NotFoundException(`Categoria de imagem '${dto.category}' não encontrada ou inválida`);
    }

    const updatedImages = currentImages.filter(
      (img) => !dto.images.includes(img)
    );

    return this.prisma.construction.update({
      where: { id },
      data: {
        [dto.category]: updatedImages,
      } as any,
    });
  }
}
