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

  async findAll() {
    const buildings = await this.prisma.building.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        status: true,
        name: true,
        location: true,
        coordinates: true,
        constructionPeriod: true,
        mediaGallery: true,
        updatedAt: true,
      } as Prisma.BuildingSelect,
    });

    return buildings.map((b) => ({
      id: b.id,
      slug: b.slug,
      status: b.status,
      name: resolveField(b.name, '', DEFAULT_LANG),
      location: resolveField(b.location, '', DEFAULT_LANG),
      coordinates: b.coordinates as { lat: number; lng: number } | null,
      construction_period: b.constructionPeriod,
      media_gallery: (
        b.mediaGallery as Array<{ url: string; type: string; caption: unknown }>
      ).map((m) => ({
        url: m.url,
        type: m.type,
        caption: resolveField(m.caption, '', DEFAULT_LANG),
      })),
      updated_at: b.updatedAt,
    }));
  }

 create(dto: CreateBuildingDto) {
    const DEFAULT_ADMIN_ID = '000000000000000000000000';
    const data = {
      slug: dto.slug,
      qrCodeKey: dto.qrCodeKey,
      architect: { connect: { id: dto.architectId } },
      name: { pt: dto.title },
      description: { pt: dto.description },
      location: { pt: dto.location },
      coordinates: dto.coordinates,
      constructionPeriod: dto.constructionPeriod,
      history: { pt: dto.history },
      createdBy: { connect: { id: dto.createdById ?? DEFAULT_ADMIN_ID } },
      updatedBy: { connect: { id: dto.updatedById ?? DEFAULT_ADMIN_ID } },
      mediaGallery: dto.images?.map((url) => ({ url, type: 'externa', caption: '' })) ?? [],
      originalName: dto.originalName ? { pt: dto.originalName } : undefined,
      ornamentsAuthor: dto.ornamentsAuthor,
      builtArea: dto.builtArea,
      currentOccupation: dto.currentOccupation ? { pt: dto.currentOccupation } : undefined,
      restorationAndHeritage: dto.restorationAndHeritage ? { pt: dto.restorationAndHeritage } : undefined,
      heritage: dto.heritage,
      sources: dto.sources ?? [],
      features: dto.features ?? [],
    } as Record<string, unknown>;
    data['constructor'] = dto.author;

    return this.prisma.building.create({ data: data as Prisma.BuildingCreateInput });
  }

  async findOne(slug: string, lang?: string) {
    if (lang !== undefined && !SUPPORTED_LANGS.includes(lang as Lang)) {
      throw new BadRequestException(`Idioma inválido: "${lang}". Use pt, en ou de.`);
    }

    const resolvedLang = (lang as Lang) ?? DEFAULT_LANG;
    
    const building = await this.prisma.building.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: {
        id: true,
        slug: true,
        architectId: true,
        name: true,
        originalName: true,
        location: true,
        coordinates: true,
        constructionPeriod: true,
        constructor: true,
        ornamentsAuthor: true,
        builtArea: true,
        currentOccupation: true,
        restorationAndHeritage: true,
        heritage: true,
        description: true,
        history: true,
        features: true,
        mediaGallery: true,
        sources: true,
        updatedAt: true,
      } as Prisma.BuildingSelect,
    });

    if (!building) {
      throw new NotFoundException(`Edificação com ID ${slug} não encontrada`);
    }

    return {
      id: building.id,
      slug: building.slug,
      architect_id: building.architectId,
      name: resolveField(building.name, '', resolvedLang),
      original_name: building.originalName
        ? resolveField(building.originalName, '', resolvedLang)
        : null,
      location: resolveField(building.location, '', resolvedLang),
      coordinates: building.coordinates as { lat: number; lng: number } | null,
      construction_period: building.constructionPeriod,
      constructor: (building as Record<string, unknown>)['constructor'] as string | null,
      ornaments_author: building.ornamentsAuthor,
      built_area: building.builtArea,
      current_occupation: building.currentOccupation
        ? resolveField(building.currentOccupation, '', resolvedLang)
        : null,
      restoration_and_heritage: building.restorationAndHeritage
        ? resolveField(building.restorationAndHeritage, '', resolvedLang)
        : null,
      heritage: (building as unknown as { heritage?: string }).heritage ?? null,
      description: resolveField(building.description, '', resolvedLang),
      history: resolveField(building.history, '', resolvedLang),
      features: building.features,
      media_gallery: (
        building.mediaGallery as Array<{ url: string; type: string; caption: unknown }>
      ).map((m) => ({
        url: m.url,
        type: m.type,
        caption: resolveField(m.caption, '', resolvedLang),
      })),
      sources: building.sources,
      updated_at: building.updatedAt,
    };
  }


  async update(id: string, dto: UpdateBuildingDto) {
    const exists = await this.prisma.building.findUnique({ where: { id }, select: { id: true } as Prisma.BuildingSelect });
    if (!exists) throw new NotFoundException(`Edificação com ID ${id} não encontrada`);

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
    if (dto.heritage !== undefined) data.heritage = dto.heritage;
    if (dto.sources !== undefined) data.sources = dto.sources;
    if (dto.features !== undefined) data.features = dto.features;

    await this.prisma.building.update({
      where: { id },
      data: data as Prisma.BuildingUpdateInput,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const exists = await this.prisma.building.findUnique({ where: { id }, select: { id: true } as Prisma.BuildingSelect });
    if (!exists) throw new NotFoundException(`Edificação com ID ${id} não encontrada`);
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
