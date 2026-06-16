import { BuildingsService } from './buildings.service';
import { BadRequestException } from '@nestjs/common';

const mockFindMany = jest.fn();

const mockPrismaService = {
  building: {
    findMany: mockFindMany,
  },
};

describe('BuildingsService', () => {
  let service: BuildingsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BuildingsService(mockPrismaService as never, {} as never);
  });

  describe('findAllForMap', () => {
    it('throws 400 for an unsupported language', async () => {
      await expect(service.findAllForMap('es')).rejects.toBeInstanceOf(BadRequestException);
      expect(mockFindMany).not.toHaveBeenCalled();
    });

    it('returns the optimized map payload with renamed coordinates and coverImage', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS', en: 'MARGS Museum' },
          description: { pt: 'Resumo em PT', en: 'Summary in EN' },
          coordinates: { lat: -30.03, lng: -51.23 },
          mediaGallery: [{ url: 'foto.jpg', caption: { pt: 'Fachada' } }],
        },
      ]);

      const result = await service.findAllForMap('en');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('MARGS Museum');
      expect(result[0].summary).toBe('Summary in EN');
      expect(result[0].coordinates).toEqual({ latitude: -30.03, longitude: -51.23 });
      expect(result[0].coverImage?.url).toBe('foto.jpg');
      expect(result[0].detailPath).toBe('/edificacoes/margs');
    });

    it('falls back to pt when the requested translation is missing', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS' },
          description: { pt: 'Resumo em PT' },
          coordinates: { lat: -30.03, lng: -51.23 },
          mediaGallery: [],
        },
      ]);

      const result = await service.findAllForMap('en');

      expect(result[0].name).toBe('MARGS');
      expect(result[0].summary).toBe('Resumo em PT');
    });

    it('defaults to pt when no lang is provided', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS', en: 'MARGS Museum' },
          description: { pt: 'Resumo em PT' },
          coordinates: null,
          mediaGallery: [],
        },
      ]);

      const result = await service.findAllForMap(undefined);

      expect(result[0].name).toBe('MARGS');
    });

    it('returns null coordinates when the building has no coordinates', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS' },
          description: { pt: 'Resumo em PT' },
          coordinates: null,
          mediaGallery: [],
        },
      ]);

      const result = await service.findAllForMap('pt');

      expect(result[0].coordinates).toBeNull();
    });

    it('returns null coverImage when mediaGallery is empty', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS' },
          description: { pt: 'Resumo em PT' },
          coordinates: null,
          mediaGallery: [],
        },
      ]);

      const result = await service.findAllForMap('pt');

      expect(result[0].coverImage).toBeNull();
    });
  });
});
