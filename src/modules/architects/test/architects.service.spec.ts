import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArchitectsService } from '../services/architects.service';

describe('ArchitectsService', () => {
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

  let service: ArchitectsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArchitectsService(prismaMock as never);
  });

  it('returns only the requested language for multilingual fields', async () => {
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
      death: null,
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

    await expect(service.findBySlug('theodor-wiederspahn', 'en')).resolves.toEqual({
      id: 'architect-id',
      slug: 'theodor-wiederspahn',
      name: {
        first: 'Theodor',
        last: 'Wiederspahn',
        full: 'Theodor Wiederspahn',
      },
      media: {
        portrait_url: '/images/architects/theodor-wiederspahn.jpg',
        alt_text: 'Portrait of Theodor Wiederspahn',
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
      about: 'English text',
      characteristics: {
        style: 'Eclecticism',
        influences: 'European training',
        legacy: 'Legacy in Porto Alegre',
      },
      notable_works: ['building-1', 'building-2'],
      updated_at: new Date('2026-04-18T14:30:00.000Z'),
    });
  });

  it('falls back to pt only when the requested translation is missing', async () => {
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
      },
      characteristics: {
        style: {
          pt: 'Ecletismo',
        },
        influences: {
          pt: 'Formação europeia',
        },
        legacy: {
          pt: 'Legado em Porto Alegre',
        },
      },
      updatedAt: new Date('2026-04-18T14:30:00.000Z'),
    });

    findMany.mockResolvedValue([{ id: 'building-1' }]);

    await expect(service.findBySlug('theodor-wiederspahn', 'de')).resolves.toMatchObject({
      media: {
        portrait_url: '/images/architects/theodor-wiederspahn.jpg',
        alt_text: 'Retrato de Theodor Wiederspahn',
      },
      about: 'Texto em português',
      characteristics: {
        style: 'Ecletismo',
        influences: 'Formação europeia',
        legacy: 'Legado em Porto Alegre',
      },
      notable_works: ['building-1'],
    });
  });

  it('throws not found when the architect does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findBySlug('missing-architect', 'pt')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(findMany).not.toHaveBeenCalled();
  });

  it('throws bad request when lang is invalid', async () => {
    await expect(service.findBySlug('theodor-wiederspahn', 'es')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(findUnique).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
  });
});
