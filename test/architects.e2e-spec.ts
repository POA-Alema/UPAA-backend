import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ArchitectsController } from '../src/modules/architects/controllers/architects.controller';
import { ArchitectsService } from '../src/modules/architects/services/architects.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ArchitectsController (e2e)', () => {
  const findUnique = jest.fn();
  const findMany = jest.fn();

  const prismaMock = {
    architect: {
      findUnique,
    },
    building: {
      findMany,
    },
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ArchitectsController],
      providers: [ArchitectsService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /architects/theodor-wiederspahn?lang=pt returns the biography fields', async () => {
    findUnique.mockResolvedValue({
      id: 'architect-id',
      slug: 'theodor-wiederspahn',
      name: {
        first: 'Theodor',
        last: 'Wiederspahn',
        full: 'Theodor Wiederspahn',
      },
      media: {
        portrait_url: '/images/architects/theodor-wiederspahn.jpg',
        alt_text: {
          pt: 'Retrato de Theodor Wiederspahn',
          en: 'Portrait of Theodor Wiederspahn',
          de: 'Portrat von Theodor Wiederspahn',
        },
      },
      birth: {
        date: {
          day: 19,
          month: 2,
          year: 1878,
          iso: '1878-02-19',
        },
        place: {
          city: 'Wiesbaden',
          country: 'Alemanha',
        },
      },
      death: {
        date: {
          day: 12,
          month: 11,
          year: 1953,
          iso: '1953-11-12',
        },
        place: {
          city: 'Porto Alegre',
          country: 'Brasil',
        },
      },
      citizenship: 'alemã',
      occupation: 'Arquiteto',
      about: {
        pt: 'Texto em português',
        en: 'English text',
        de: 'Text auf Deutsch',
      },
      characteristics: {
        style: {
          pt: 'Ecletismo',
          en: 'Eclecticism',
          de: 'Eklektizismus',
        },
        influences: {
          pt: 'Formação europeia',
          en: 'European training',
          de: 'Europäische Ausbildung',
        },
        legacy: {
          pt: 'Legado em Porto Alegre',
          en: 'Legacy in Porto Alegre',
          de: 'Vermächtnis in Porto Alegre',
        },
      },
      updatedAt: new Date('2026-04-18T14:30:00.000Z'),
    });

    findMany.mockResolvedValue([{ id: 'building-1' }, { id: 'building-2' }]);

    const response = await request(app.getHttpServer())
      .get('/architects/theodor-wiederspahn')
      .query({ lang: 'pt' })
      .expect(200);

    expect(response.body).toEqual({
      id: 'architect-id',
      slug: 'theodor-wiederspahn',
      name: {
        first: 'Theodor',
        last: 'Wiederspahn',
        full: 'Theodor Wiederspahn',
      },
      media: {
        portrait_url: '/images/architects/theodor-wiederspahn.jpg',
        alt_text: 'Retrato de Theodor Wiederspahn',
      },
      birth: {
        date: {
          day: 19,
          month: 2,
          year: 1878,
          iso: '1878-02-19',
        },
        place: {
          city: 'Wiesbaden',
          country: 'Alemanha',
        },
      },
      death: {
        date: {
          day: 12,
          month: 11,
          year: 1953,
          iso: '1953-11-12',
        },
        place: {
          city: 'Porto Alegre',
          country: 'Brasil',
        },
      },
      citizenship: 'alemã',
      occupation: 'Arquiteto',
      about: 'Texto em português',
      characteristics: {
        style: 'Ecletismo',
        influences: 'Formação europeia',
        legacy: 'Legado em Porto Alegre',
      },
      notable_works: ['building-1', 'building-2'],
      updated_at: '2026-04-18T14:30:00.000Z',
    });
  });

  it('GET /architects/theodor-wiederspahn?lang=de falls back to pt only for missing translations', async () => {
    findUnique.mockResolvedValue({
      id: 'architect-id',
      slug: 'theodor-wiederspahn',
      name: {
        first: 'Theodor',
        last: 'Wiederspahn',
        full: 'Theodor Wiederspahn',
      },
      media: {
        portrait_url: '/images/architects/theodor-wiederspahn.jpg',
        alt_text: {
          pt: 'Retrato de Theodor Wiederspahn',
        },
      },
      birth: {
        date: {
          day: 19,
          month: 2,
          year: 1878,
          iso: '1878-02-19',
        },
        place: {
          city: 'Wiesbaden',
          country: 'Alemanha',
        },
      },
      death: null,
      citizenship: 'alemã',
      occupation: 'Arquiteto',
      about: {
        pt: 'Texto em português',
        de: 'Text auf Deutsch',
      },
      characteristics: {
        style: {
          pt: 'Ecletismo',
          de: 'Eklektizismus',
        },
        influences: {
          pt: 'Formação europeia',
        },
        legacy: {
          pt: 'Legado em Porto Alegre',
          de: 'Vermächtnis in Porto Alegre',
        },
      },
      updatedAt: new Date('2026-04-18T14:30:00.000Z'),
    });

    findMany.mockResolvedValue([{ id: 'building-1' }]);

    const response = await request(app.getHttpServer())
      .get('/architects/theodor-wiederspahn')
      .query({ lang: 'de' })
      .expect(200);

    expect(response.body.media.alt_text).toBe('Retrato de Theodor Wiederspahn');
    expect(response.body.about).toBe('Text auf Deutsch');
    expect(response.body.characteristics).toEqual({
      style: 'Eklektizismus',
      influences: 'Formação europeia',
      legacy: 'Vermächtnis in Porto Alegre',
    });
  });

  it('GET /architects/theodor-wiederspahn?lang=es returns 400', async () => {
    await request(app.getHttpServer())
      .get('/architects/theodor-wiederspahn')
      .query({ lang: 'es' })
      .expect(400);
  });

  it('GET /architects/missing-architect?lang=pt returns 404', async () => {
    findUnique.mockResolvedValue(null);

    await request(app.getHttpServer())
      .get('/architects/missing-architect')
      .query({ lang: 'pt' })
      .expect(404);
  });
});
