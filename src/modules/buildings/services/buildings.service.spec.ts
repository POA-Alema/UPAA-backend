import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsService } from './buildings.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('BuildingsService', () => {
  let service: BuildingsService;
  const mockPrismaService = {
    building: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
  });

  describe('findAllForMap', () => {
    it('deve retornar erro HTTP 400 se o idioma solicitado for inválido', async () => {
      await expect(service.findAllForMap('es')).rejects.toThrow(BadRequestException);
    });

    it('deve otimizar o payload do mapa, ajustar coordenadas e aplicar fallback de idioma', async () => {
      mockPrismaService.building.findMany.mockResolvedValue([
        {
          id: '66b4f1f8',
          slug: 'margs',
          name: { pt: 'MARGS', en: 'MARGS Museum' },
          description: { pt: 'Resumo em PT' },
          coordinates: { lat: -30.03, lng: -51.23 },
          mediaGallery: [{ url: 'foto.jpg', caption: { pt: 'Fachada' } }],
        },
      ]);

      const result = await service.findAllForMap('en');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('MARGS Museum');
      expect(result[0].summary).toBe('Resumo em PT'); 
      expect(result[0].coordinates).toEqual({ latitude: -30.03, longitude: -51.23 }); 
      expect(result[0].coverImage?.url).toBe('foto.jpg'); 
      expect(result[0].detailPath).toBe('/edificacoes/margs'); 
    });
  });
});