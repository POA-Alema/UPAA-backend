import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.building.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const building = await this.prisma.building.findUnique({
      where: { id },
    });
    if (!building) {
      throw new NotFoundException(`Edificação com ID ${id} não encontrada`);
    }
    return building;
  }

  create(dto: CreateBuildingDto) {
    const data = {
      slug: dto.slug,
      qrCodeKey: dto.qrCodeKey,
      architectId: dto.architectId,
      name: { pt: dto.title },
      description: { pt: dto.description },
      location: { pt: dto.location },
      coordinates: dto.coordinates,
      constructionPeriod: dto.constructionPeriod,
      history: { pt: dto.history },
      createdById: dto.createdById,
      updatedById: dto.updatedById,
      mediaGallery: dto.images?.map((url) => ({ url, type: 'externa', caption: '' })) ?? [],
      originalName: dto.originalName ? { pt: dto.originalName } : undefined,
      ornamentsAuthor: dto.ornamentsAuthor,
      builtArea: dto.builtArea,
      currentOccupation: dto.currentOccupation ? { pt: dto.currentOccupation } : undefined,
      restorationAndHeritage: dto.restorationAndHeritage ? { pt: dto.restorationAndHeritage } : undefined,
      sources: dto.sources ?? [],
      features: dto.features ?? [],
    } as Record<string, unknown>;
    data['constructor'] = dto.author;

    return this.prisma.building.create({ data: data as Prisma.BuildingUncheckedCreateInput });
  }

  async update(id: string, dto: UpdateBuildingDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) data.name = { pt: dto.title };
    if (dto.description !== undefined) data.description = { pt: dto.description };
    if (dto.author !== undefined) data['constructor'] = dto.author;
    if (dto.images !== undefined) {
      data.mediaGallery = dto.images.map((url) => ({ url, type: 'externa', caption: '' }));
    }

    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.qrCodeKey !== undefined) data.qrCodeKey = dto.qrCodeKey;
    if (dto.architectId !== undefined) data.architectId = dto.architectId;
    if (dto.location !== undefined) data.location = { pt: dto.location };
    if (dto.coordinates !== undefined) data.coordinates = dto.coordinates;
    if (dto.constructionPeriod !== undefined) data.constructionPeriod = dto.constructionPeriod;
    if (dto.history !== undefined) data.history = { pt: dto.history };
    if (dto.createdById !== undefined) data.createdById = dto.createdById;
    if (dto.updatedById !== undefined) data.updatedById = dto.updatedById;
    if (dto.originalName !== undefined) data.originalName = { pt: dto.originalName };
    if (dto.ornamentsAuthor !== undefined) data.ornamentsAuthor = dto.ornamentsAuthor;
    if (dto.builtArea !== undefined) data.builtArea = dto.builtArea;
    if (dto.currentOccupation !== undefined) data.currentOccupation = { pt: dto.currentOccupation };
    if (dto.restorationAndHeritage !== undefined) data.restorationAndHeritage = { pt: dto.restorationAndHeritage };
    if (dto.sources !== undefined) data.sources = dto.sources;
    if (dto.features !== undefined) data.features = dto.features;

    return this.prisma.building.update({
      where: { id },
      data: data as Prisma.BuildingUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.building.delete({
      where: { id },
    });
  }
}
