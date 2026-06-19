import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Service } from '../../../Utils/S3.service';
import { CreateBuildingDto, BuildingImageDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import {
  SupportedLanguage,
  SUPPORTED_LANGS,
  validateLanguage,
  translateLocalizedValue,
} from '../../../common/i18n';

const DEFAULT_LANG: SupportedLanguage = 'pt';

const SEED_ADMIN_ID = '000000000000000000000000';

const IMAGE_TYPES = ['planta_baixa', 'fachada', 'externa', 'interna'] as const;
type ImageTypeValue = (typeof IMAGE_TYPES)[number];
const DEFAULT_IMAGE_TYPE: ImageTypeValue = 'externa';

function isObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function resolveField(i18nField: unknown, fallback: string, lang: SupportedLanguage): string {
  if (typeof i18nField === 'string') return i18nField;
  if (i18nField && typeof i18nField === 'object') {
    const map = i18nField as Record<string, string>;
    return map[lang] ?? SUPPORTED_LANGS.map((l) => map[l]).find((v) => v !== undefined) ?? fallback;
  }
  return fallback;
}

function toI18n(value: unknown): { pt: string; en: string; de: string } {
  if (value && typeof value === 'object') {
    const map = value as Record<string, string>;
    const base = map.pt ?? map.en ?? map.de ?? '';
    return { pt: map.pt ?? base, en: map.en ?? base, de: map.de ?? base };
  }
  const text = typeof value === 'string' ? value : '';
  return { pt: text, en: text, de: text };
}

function normalizeImageType(type: unknown): ImageTypeValue {
  return typeof type === 'string' && (IMAGE_TYPES as readonly string[]).includes(type)
    ? (type as ImageTypeValue)
    : DEFAULT_IMAGE_TYPE;
}

function mapImages(images: Array<BuildingImageDto | string> | undefined) {
  return (images ?? []).map((image) => {
    if (typeof image === 'string') {
      return { url: image, type: DEFAULT_IMAGE_TYPE, caption: toI18n('') };
    }
    return {
      url: image.url,
      type: normalizeImageType(image.type),
      caption: toI18n(image.caption),
    };
  });
}

@Injectable()
export class BuildingsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async findAll(lang: string = DEFAULT_LANG) {
    const resolvedLang = validateLanguage(lang);

    const buildings = await this.prisma.building.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        status: true,
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
        description: true,
        history: true,
        features: true,
        mediaGallery: true,
        sources: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return buildings.map((building) => translateLocalizedValue(building, resolvedLang));
  }

  create(dto: CreateBuildingDto) {
    const data = {
      slug: dto.slug,
      qrCodeKey: dto.qrCodeKey,
      status: 'published',
      architectId: dto.architectId,
      name: toI18n(dto.title),
      description: toI18n(dto.description),
      location: toI18n(dto.location),
      coordinates: dto.coordinates,
      constructionPeriod: dto.constructionPeriod,
      history: toI18n(dto.history),
      createdById: dto.createdById ?? SEED_ADMIN_ID,
      updatedById: dto.updatedById ?? SEED_ADMIN_ID,
      mediaGallery: mapImages(dto.images),
      originalName: dto.originalName ? toI18n(dto.originalName) : undefined,
      ornamentsAuthor: dto.ornamentsAuthor,
      builtArea: dto.builtArea,
      currentOccupation: dto.currentOccupation ? toI18n(dto.currentOccupation) : undefined,
      restorationAndHeritage: dto.restorationAndHeritage
        ? toI18n(dto.restorationAndHeritage)
        : undefined,
      sources: dto.sources ?? [],
      features: dto.features ?? [],
    } as Record<string, unknown>;
    // DB column is "constructor"; the DTO exposes it as "author".
    data['constructor'] = dto.author;

    return this.prisma.building.create({ data: data as Prisma.BuildingCreateInput });
  }

  async findOne(slugOrId: string, lang?: string) {
    const resolvedLang = validateLanguage(lang ?? DEFAULT_LANG);

    const building = await this.prisma.building.findFirst({
      where: {
        OR: [{ slug: slugOrId }, ...(isObjectId(slugOrId) ? [{ id: slugOrId }] : [])],
      },
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
        description: true,
        history: true,
        features: true,
        mediaGallery: true,
        sources: true,
        updatedAt: true,
      },
    });

    if (!building) {
      throw new NotFoundException(`Edificação com ID ${slugOrId} não encontrada`);
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
      constructor: building.constructor,
      ornaments_author: building.ornamentsAuthor,
      built_area: building.builtArea,
      current_occupation: building.currentOccupation
        ? resolveField(building.currentOccupation, '', resolvedLang)
        : null,
      restoration_and_heritage: building.restorationAndHeritage
        ? resolveField(building.restorationAndHeritage, '', resolvedLang)
        : null,
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
    const existing = await this.ensureExists(id);

    const data: Record<string, unknown> = {};
    const nextGallery = dto.images !== undefined ? mapImages(dto.images) : undefined;

    if (dto.title !== undefined) data.name = toI18n(dto.title);
    if (dto.description !== undefined) data.description = toI18n(dto.description);
    if (dto.author !== undefined) data['constructor'] = dto.author;
    if (nextGallery !== undefined) data.mediaGallery = nextGallery;

    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.qrCodeKey !== undefined) data.qrCodeKey = dto.qrCodeKey;
    if (dto.architectId !== undefined) data.architectId = dto.architectId;
    if (dto.location !== undefined) data.location = toI18n(dto.location);
    if (dto.coordinates !== undefined) data.coordinates = dto.coordinates;
    if (dto.constructionPeriod !== undefined) data.constructionPeriod = dto.constructionPeriod;
    if (dto.history !== undefined) data.history = toI18n(dto.history);
    if (dto.createdById !== undefined) data.createdById = dto.createdById;
    if (dto.updatedById !== undefined) data.updatedById = dto.updatedById;
    if (dto.originalName !== undefined) data.originalName = toI18n(dto.originalName);
    if (dto.ornamentsAuthor !== undefined) data.ornamentsAuthor = dto.ornamentsAuthor;
    if (dto.builtArea !== undefined) data.builtArea = dto.builtArea;
    if (dto.currentOccupation !== undefined) data.currentOccupation = toI18n(dto.currentOccupation);
    if (dto.restorationAndHeritage !== undefined)
      data.restorationAndHeritage = toI18n(dto.restorationAndHeritage);
    if (dto.sources !== undefined) data.sources = dto.sources;
    if (dto.features !== undefined) data.features = dto.features;

    const updated = await this.prisma.building.update({
      where: { id },
      data: data as Prisma.BuildingUpdateInput,
      select: {
        id: true, slug: true, status: true, architectId: true, name: true,
        originalName: true, location: true, coordinates: true, constructionPeriod: true,
        constructor: true, ornamentsAuthor: true, builtArea: true, currentOccupation: true,
        restorationAndHeritage: true, description: true, history: true, features: true,
        mediaGallery: true, sources: true, createdAt: true, updatedAt: true,
      },
    });

    if (nextGallery !== undefined) {
      const nextUrls = new Set(nextGallery.map((image) => image.url));
      const removedUrls = this.galleryUrls(existing.mediaGallery).filter(
        (url) => !nextUrls.has(url),
      );
      await this.deleteUploadsFromS3(removedUrls);
    }

    return updated;
  }

  async remove(id: string) {
    const existing = await this.ensureExists(id);
    const deleted = await this.prisma.building.delete({
      where: { id },
      select: { id: true, slug: true, constructor: false },
    });

    await this.deleteUploadsFromS3(this.galleryUrls(existing.mediaGallery));

    return deleted;
  }

  private async ensureExists(id: string) {
    const building = await this.prisma.building.findUnique({ where: { id } });
    if (!building) {
      throw new NotFoundException(`Edificação com ID ${id} não encontrada`);
    }

    return building;
  }

  private galleryUrls(mediaGallery: unknown): string[] {
    if (!Array.isArray(mediaGallery)) return [];
    return mediaGallery
      .map((item) =>
        item && typeof item === 'object' ? (item as { url?: unknown }).url : undefined,
      )
      .filter((url): url is string => typeof url === 'string' && url.length > 0);
  }

  // Best-effort: o S3Service só remove objetos do prefixo de uploads do bucket
  // e trata/loga falhas individualmente, sem propagar erro ao chamador.
  private async deleteUploadsFromS3(urls: string[]) {
    await Promise.all(
      [...new Set(urls)].map((url) => this.s3Service.deleteUploadedFileByUrl(url)),
    );
  }

  async findAllForMap(lang: string = DEFAULT_LANG) {
    const resolvedLang = validateLanguage(lang);

    const buildings = await this.prisma.building.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        slug: true,
        name: true,
        coordinates: true,
        description: true,
        mediaGallery: true,
        constructor: false,
      },
    });

    return buildings.map((building) => {
      const name = resolveField(building.name, '', resolvedLang);
      const summary = resolveField(building.description, '', resolvedLang);

      const rawCoords = building.coordinates as { lat: number; lng: number } | null;
      const coordinates = rawCoords
        ? { latitude: rawCoords.lat, longitude: rawCoords.lng }
        : null;

      const media = building.mediaGallery as Array<{ url: string; caption?: unknown; alt?: unknown }> | null;
      let coverImage = null;

      if (media && media.length > 0) {
        const firstImage = media[0];
        coverImage = {
          url: firstImage.url,
          alt: resolveField(firstImage.alt, `Fachada de ${name}`, resolvedLang),
          caption: resolveField(firstImage.caption, '', resolvedLang),
        };
      }

      return {
        id: building.id,
        slug: building.slug,
        name,
        coordinates,
        coverImage,
        summary,
        detailPath: `/edificacoes/${building.slug}`,
      };
    });
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
