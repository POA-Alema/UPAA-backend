import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';

const SUPPORTED_LANGS = ['pt', 'en', 'de'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG: Lang = 'pt';

function resolveField(i18nField: unknown, fallback: string, lang: Lang): string {
  if (typeof i18nField === 'string') return i18nField;
  if (i18nField && typeof i18nField === 'object') {
    const map = i18nField as Record<string, string>;
    return map[lang] ?? map[DEFAULT_LANG] ?? fallback;
  }
  return fallback;
}

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

    return this.prisma.building.create({ data: data as Prisma.BuildingCreateInput });
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
      data: data as Prisma.BuildingUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.building.delete({
      where: { id },
    });
  }

  async findAllForMap(lang?: string) {
    if (lang !== undefined && !SUPPORTED_LANGS.includes(lang as Lang)) {
      throw new BadRequestException(`Idioma inválido: "${lang}". Use pt, en ou de.`);
    }

    const resolvedLang = (lang as Lang) ?? DEFAULT_LANG;

    const buildings = await this.prisma.building.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        slug: true,
        architectId: true,
        name: true,
        location: true,
        coordinates: true,
        currentOccupation: true,
        mediaGallery: true,
      } as Prisma.BuildingSelect,
    });

    return buildings.map((building) => ({
      id: building.id,
      slug: building.slug,
      architect_id: building.architectId,
      name: resolveField(building.name, '', resolvedLang),
      location: resolveField(building.location, '', resolvedLang),
      coordinates: building.coordinates as { lat: number; lng: number } | null,
      current_occupation: building.currentOccupation
        ? resolveField(building.currentOccupation, '', resolvedLang)
        : null,
      media_gallery: (
        building.mediaGallery as Array<{ url: string; type: string; caption: unknown }>
      ).map((m) => ({
        url: m.url,
        type: m.type,
        caption: resolveField(m.caption, '', resolvedLang),
      })),
    }));
  }

  getInitialMapConfig() {
    return {
      center: { lat: -30.0269, lng: -51.2254 },
      zoom: 15,
      min_zoom: 12,
      max_zoom: 18,
    };
  }
}
