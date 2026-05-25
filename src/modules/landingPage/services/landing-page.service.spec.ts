import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { MultilingualTextDto } from '../dto/multilingual-text.dto';

const MOCK_ADMIN_ID = '000000000000000000000000';

const mockImmigrationSection = {
  imageURL: '/images/home/imigracao-alema-rs.jpg',
  imageAlt: 'Registros históricos da imigração alemã no Rio Grande do Sul',
  title: {
    pt: 'Imigração alemã',
    en: 'German immigration',
    de: 'Deutsche Einwanderung',
  },
  content: {
    pt: 'A partir de 1824, imigrantes alemães chegaram ao Rio Grande do Sul.',
    en: 'From 1824 onwards, German immigrants arrived in Rio Grande do Sul.',
    de: 'Ab 1824 kamen deutsche Einwanderer nach Rio Grande do Sul.',
  },
};

const mockLandingPage = {
  id: 'landing-page-id-1',
  mainTitle: { pt: 'Uma Porto Alegre alemã' },
  subtitle: { pt: 'Subtítulo' },
  architectSection: {},
  immigrationSection: mockImmigrationSection,
  institutionsSection: {},
  updatedById: MOCK_ADMIN_ID,
  updatedAt: new Date(),
};

const mockPrismaService = {
  landingPage: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('LandingPageService', () => {
  let service: LandingPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandingPageService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LandingPageService>(LandingPageService);
    jest.clearAllMocks();
  });

  describe('findPublic()', () => {
    it('deve retornar título e conteúdo da immigrationSection', async () => {
      mockPrismaService.landingPage.findFirst.mockResolvedValue(mockLandingPage);
      const result = await service.findPublic();
      const section = result!.immigrationSection as typeof mockImmigrationSection;
      expect(section.title.pt).toBe('Imigração alemã');
      expect(section.content.pt).toContain('1824');
    });

    it('deve retornar imageURL quando presente na immigrationSection', async () => {
      mockPrismaService.landingPage.findFirst.mockResolvedValue(mockLandingPage);
      const result = await service.findPublic();
      const section = result!.immigrationSection as typeof mockImmigrationSection;
      expect(section.imageURL).toBe('/images/home/imigracao-alema-rs.jpg');
    });

    it('deve retornar dados mockados vindos do banco (seed)', async () => {
      mockPrismaService.landingPage.findFirst.mockResolvedValue(mockLandingPage);
      const result = await service.findPublic();
      expect(mockPrismaService.landingPage.findFirst).toHaveBeenCalledTimes(1);
      expect(result!.id).toBe('landing-page-id-1');
    });

    it('não deve retornar erro quando a immigrationSection estiver ausente', async () => {
      const pageWithoutSection = { ...mockLandingPage, immigrationSection: null };
      mockPrismaService.landingPage.findFirst.mockResolvedValue(pageWithoutSection);
      const result = await service.findPublic();
      expect(result).not.toBeNull();
      expect(result!.immigrationSection).toBeNull();
    });

    it('não deve retornar erro quando não houver registro de landing page', async () => {
      mockPrismaService.landingPage.findFirst.mockResolvedValue(null);
      const result = await service.findPublic();
      expect(result).toBeNull();
    });

    it('deve retornar estrutura multilíngue consistente (pt, en, de)', async () => {
      mockPrismaService.landingPage.findFirst.mockResolvedValue(mockLandingPage);
      const result = await service.findPublic();
      const section = result!.immigrationSection as typeof mockImmigrationSection;
      expect(section.title.pt).toBeDefined();
      expect(section.title.en).toBeDefined();
      expect(section.title.de).toBeDefined();
      expect(section.content.pt).toBeDefined();
      expect(section.content.en).toBeDefined();
      expect(section.content.de).toBeDefined();
    });
  });

  describe('create()', () => {
    it('deve criar landing page com immigrationSection válida', async () => {
      mockPrismaService.landingPage.create.mockResolvedValue(mockLandingPage);
      const result = await service.create(
        { immigrationSection: mockImmigrationSection },
        MOCK_ADMIN_ID,
      );
      expect(mockPrismaService.landingPage.create).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('deve lançar BadRequestException se title.pt estiver ausente', async () => {
      await expect(
        service.create(
          { immigrationSection: { content: { pt: 'Conteúdo válido' } } },
          MOCK_ADMIN_ID,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se content.pt estiver ausente', async () => {
      await expect(
        service.create(
          {
            immigrationSection: {
              title: { pt: 'Título válido' },
              content: {} as MultilingualTextDto,
            },
          },
          MOCK_ADMIN_ID,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update()', () => {
    it('deve atualizar a immigrationSection corretamente', async () => {
      mockPrismaService.landingPage.findUnique.mockResolvedValue(mockLandingPage);
      mockPrismaService.landingPage.update.mockResolvedValue({
        ...mockLandingPage,
        immigrationSection: {
          ...mockImmigrationSection,
          title: { pt: 'Novo título', en: 'New title', de: 'Neuer Titel' },
        },
      });
      const result = await service.update(
        'landing-page-id-1',
        {
          immigrationSection: {
            title: { pt: 'Novo título', en: 'New title', de: 'Neuer Titel' },
            content: { pt: 'Conteúdo atualizado' },
          },
        },
        MOCK_ADMIN_ID,
      );
      const section = result.immigrationSection as {
        title: { pt: string };
      };
      expect(section.title.pt).toBe('Novo título');
    });

    it('deve lançar NotFoundException se o ID não existir', async () => {
      mockPrismaService.landingPage.findUnique.mockResolvedValue(null);
      await expect(
        service.update('id-invalido', {}, MOCK_ADMIN_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('deve deletar a landing page existente', async () => {
      mockPrismaService.landingPage.findUnique.mockResolvedValue(mockLandingPage);
      mockPrismaService.landingPage.delete.mockResolvedValue(mockLandingPage);
      const result = await service.remove('landing-page-id-1');
      expect(mockPrismaService.landingPage.delete).toHaveBeenCalledWith({
        where: { id: 'landing-page-id-1' },
      });
      expect(result).toBeDefined();
    });

    it('deve lançar NotFoundException se o ID não existir', async () => {
      mockPrismaService.landingPage.findUnique.mockResolvedValue(null);
      await expect(service.remove('id-invalido')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Acessibilidade - imageAlt validation', () => {
    it('deve retornar imageAlt quando presente na immigrationSection', async () => {
      const pageWithAlt = {
        ...mockLandingPage,
        immigrationSection: {
          ...mockImmigrationSection,
          imageAlt: 'Descrição da imagem de imigração alemã',
        },
      };
      mockPrismaService.landingPage.findFirst.mockResolvedValue(pageWithAlt);
      const result = await service.findPublic();
      const section = result!.immigrationSection as typeof mockImmigrationSection & {
        imageAlt?: string;
      };
      expect(section.imageAlt).toBe('Descrição da imagem de imigração alemã');
    });

    it('deve lançar BadRequestException se imageURL está presente mas imageAlt está ausente', async () => {
      const invalidSection = {
        title: { pt: 'Título válido' },
        content: { pt: 'Conteúdo válido' },
        imageURL: '/images/test.jpg',
        imageAlt: '', // imageAlt vazio, deve falhar
      };

      await expect(
        service.create({ immigrationSection: invalidSection }, MOCK_ADMIN_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se imageURL está presente mas imageAlt é null', async () => {
      const invalidSection = {
        title: { pt: 'Título válido' },
        content: { pt: 'Conteúdo válido' },
        imageURL: '/images/test.jpg',
        imageAlt: null,
      };

      await expect(
        service.create(
          { immigrationSection: invalidSection as any },
          MOCK_ADMIN_ID,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve permitir imageURL sem imageAlt apenas se imageURL estiver vazio/null', async () => {
      mockPrismaService.landingPage.create.mockResolvedValue(mockLandingPage);
      const validSection = {
        title: { pt: 'Título válido' },
        content: { pt: 'Conteúdo válido' },
        // sem imageURL
      };

      const result = await service.create(
        { immigrationSection: validSection },
        MOCK_ADMIN_ID,
      );
      expect(result).toBeDefined();
    });

    it('deve validar acessibilidade em update() também', async () => {
      mockPrismaService.landingPage.findUnique.mockResolvedValue(mockLandingPage);

      const invalidUpdate = {
        immigrationSection: {
          title: { pt: 'Novo título' },
          content: { pt: 'Novo conteúdo' },
          imageURL: '/images/new.jpg',
          imageAlt: '', // inválido
        },
      };

      await expect(
        service.update('landing-page-id-1', invalidUpdate, MOCK_ADMIN_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve aceitar structure sem quebra semântica - conteúdo multilíngue consistente', async () => {
      const structuredSection = {
        title: { pt: 'Título', en: 'Title', de: 'Titel' },
        content: { pt: 'Conteúdo', en: 'Content', de: 'Inhalt' },
        imageURL: '/images/test.jpg',
        imageAlt: 'Imagem de teste',
      };

      mockPrismaService.landingPage.create.mockResolvedValue({
        ...mockLandingPage,
        immigrationSection: structuredSection,
      });

      const result = await service.create(
        { immigrationSection: structuredSection },
        MOCK_ADMIN_ID,
      );

      const section = result.immigrationSection as typeof structuredSection;
      // Valida estrutura semântica consistente
      expect(section.title).toHaveProperty('pt');
      expect(section.title).toHaveProperty('en');
      expect(section.title).toHaveProperty('de');
      expect(section.content).toHaveProperty('pt');
      expect(section.content).toHaveProperty('en');
      expect(section.content).toHaveProperty('de');
      expect(section.imageAlt).toBeDefined();
    });
  });
});
