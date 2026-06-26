import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArchitectsService } from '../services/architects.service';
import { AdminRole } from '../../auth/constants/admin-role';
import { AuthenticatedAdmin } from '../../auth/types/authenticated-admin';

describe('ArchitectsService', () => {
  const findUnique = jest.fn();
  const findMany = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const remove = jest.fn();
  const count = jest.fn();
  const deleteUploadedFileByUrl = jest.fn();
  const uploadFile = jest.fn();

  const prismaMock = {
    architect: {
      findUnique,
      findMany: jest.fn(),
      create,
      update,
      delete: remove,
    },
    building: {
      findMany,
      count,
    },
  };

  let service: ArchitectsService;
  const currentAdmin: AuthenticatedAdmin = {
    id: '000000000000000000000001',
    name: 'Admin',
    email: 'admin@poaalema.com',
    role: AdminRole.ADMIN,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArchitectsService(
      prismaMock as never,
      { deleteUploadedFileByUrl, uploadFile } as never,
    );
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

  it('creates an admin architect with embedded Prisma fields and current admin ids', async () => {
    create.mockImplementation(({ data }) => ({
      id: 'architect-id',
      ...data,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    }));

    const result = await service.create(
      {
        slug: 'slug-manual-ignorado',
        firstName: 'Theodor',
        lastName: 'Wiederspahn',
        portraitUrl: 'https://bucket/uploads/theodor.png',
        portraitAlt: 'Retrato de Theodor Wiederspahn',
        birthDay: 19,
        birthMonth: 2,
        birthYear: 1878,
        birthCity: 'Wiesbaden',
        birthCountry: 'Alemanha',
        citizenship: 'alemã',
        occupation: 'Arquiteto',
        about: '<p>Biografia</p>',
        style: 'Ecletismo',
        influences: 'Formação europeia',
        legacy: 'Legado em Porto Alegre',
      },
      currentAdmin,
    );

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: 'theodor-wiederspahn',
        status: 'published',
        createdById: currentAdmin.id,
        updatedById: currentAdmin.id,
        name: {
          first: 'Theodor',
          last: 'Wiederspahn',
          full: 'Theodor Wiederspahn',
        },
        media: {
          portrait_url: 'https://bucket/uploads/theodor.png',
          alt_text: {
            pt: 'Retrato de Theodor Wiederspahn',
            en: 'Retrato de Theodor Wiederspahn',
            de: 'Retrato de Theodor Wiederspahn',
          },
        },
      }),
    });
    expect(result).toMatchObject({
      id: 'architect-id',
      fullName: 'Theodor Wiederspahn',
      portraitUrl: 'https://bucket/uploads/theodor.png',
    });
  });

  it('updates an admin architect and removes the previous uploaded portrait', async () => {
    findUnique.mockResolvedValue({
      id: 'architect-id',
      slug: 'old-slug',
      status: 'published',
      name: { first: 'Theodor', last: 'Wiederspahn', full: 'Theodor Wiederspahn' },
      media: {
        portrait_url: 'https://bucket/uploads/old.png',
        alt_text: { pt: 'Retrato antigo', en: 'Retrato antigo', de: 'Retrato antigo' },
      },
      birth: {
        date: { day: 19, month: 2, year: 1878, iso: '1878-02-19' },
        place: { city: 'Wiesbaden', country: 'Alemanha' },
      },
      death: null,
      citizenship: 'alemã',
      occupation: 'Arquiteto',
      about: { pt: 'Bio', en: 'Bio', de: 'Bio' },
      characteristics: {
        style: { pt: 'Ecletismo', en: 'Ecletismo', de: 'Ecletismo' },
        influences: { pt: 'Europa', en: 'Europa', de: 'Europa' },
        legacy: { pt: 'Legado', en: 'Legado', de: 'Legado' },
      },
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    update.mockImplementation(({ data }) => ({
      id: 'architect-id',
      slug: 'old-slug',
      status: 'published',
      name: { first: 'Theodor', last: 'Wiederspahn', full: 'Theodor Wiederspahn' },
      media: data.media,
      birth: {
        date: { day: 19, month: 2, year: 1878, iso: '1878-02-19' },
        place: { city: 'Wiesbaden', country: 'Alemanha' },
      },
      death: null,
      citizenship: 'alemã',
      occupation: 'Arquiteto',
      about: { pt: 'Bio', en: 'Bio', de: 'Bio' },
      characteristics: {
        style: { pt: 'Ecletismo', en: 'Ecletismo', de: 'Ecletismo' },
        influences: { pt: 'Europa', en: 'Europa', de: 'Europa' },
        legacy: { pt: 'Legado', en: 'Legado', de: 'Legado' },
      },
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    }));

    await service.update(
      'architect-id',
      {
        portraitUrl: 'https://bucket/uploads/new.png',
        portraitAlt: 'Retrato novo',
      },
      currentAdmin,
    );

    expect(update).toHaveBeenCalledWith({
      where: { id: 'architect-id' },
      data: expect.objectContaining({
        updatedById: currentAdmin.id,
        media: {
          portrait_url: 'https://bucket/uploads/new.png',
          alt_text: { pt: 'Retrato novo', en: 'Retrato novo', de: 'Retrato novo' },
        },
      }),
    });
    expect(deleteUploadedFileByUrl).toHaveBeenCalledWith('https://bucket/uploads/old.png');
  });

  it('does not remove an architect that has linked buildings', async () => {
    findUnique.mockResolvedValue({ id: 'architect-id', media: {} });
    count.mockResolvedValue(1);

    await expect(service.remove('architect-id')).rejects.toBeInstanceOf(BadRequestException);
    expect(remove).not.toHaveBeenCalled();
  });
});
