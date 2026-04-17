import { NotFoundException } from '@nestjs/common';
import { ConstructionsService } from './constructions.service';

describe('ConstructionsService - edificacao detail', () => {
  const mockPrisma = {
    construction: {
      findUnique: jest.fn(),
    },
  };

  const service = new ConstructionsService(mockPrisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna dados basicos de edificacao valida', async () => {
    mockPrisma.construction.findUnique.mockResolvedValue({
      id: '1',
      title: 'Igreja Sao Pedro',
      address: 'Rua A, 100',
      description: 'Descricao base',
      images: ['img-1.jpg'],
    });

    const result = await service.findEdificacaoById('1', 'pt');

    expect(result).toEqual({
      nome: 'Igreja Sao Pedro',
      endereco: 'Rua A, 100',
      conteudo: 'Descricao base',
      midias: ['img-1.jpg'],
    });
  });

  it('retorna erro quando edificacao nao existe', async () => {
    mockPrisma.construction.findUnique.mockResolvedValue(null);

    await expect(service.findEdificacaoById('nao-existe', 'pt')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('retorna erro quando id e invalido para consulta', async () => {
    mockPrisma.construction.findUnique.mockRejectedValue(new Error('invalid id'));

    await expect(service.findEdificacaoById('invalido', 'pt')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('permite dados opcionais ausentes', async () => {
    mockPrisma.construction.findUnique.mockResolvedValue({
      id: '2',
      title: 'Predio Historico',
      address: null,
      description: null,
      images: null,
    });

    const result = await service.findEdificacaoById('2', 'pt');

    expect(result).toEqual({
      nome: 'Predio Historico',
      endereco: null,
      conteudo: null,
      midias: null,
    });
  });

  it('respeita idioma com fallback para pt', async () => {
    mockPrisma.construction.findUnique.mockResolvedValue({
      id: '3',
      title: { pt: 'Casa da Cultura', en: 'House of Culture' },
      address: { pt: 'Rua B, 200', en: 'B Street, 200' },
      description: { pt: 'Conteudo PT', de: 'Inhalt DE' },
      images: { pt: ['pt-1.jpg'], en: ['en-1.jpg'] },
    });

    const resultEn = await service.findEdificacaoById('3', 'en');
    const resultDe = await service.findEdificacaoById('3', 'de');

    expect(resultEn).toEqual({
      nome: 'House of Culture',
      endereco: 'B Street, 200',
      conteudo: 'Conteudo PT',
      midias: ['en-1.jpg'],
    });

    expect(resultDe).toEqual({
      nome: 'Casa da Cultura',
      endereco: 'Rua B, 200',
      conteudo: 'Inhalt DE',
      midias: ['pt-1.jpg'],
    });
  });

  it('faz fallback de idioma invalido para pt', async () => {
    mockPrisma.construction.findUnique.mockResolvedValue({
      id: '4',
      title: { pt: 'Titulo PT', en: 'Title EN' },
      address: { pt: 'Endereco PT' },
      description: { pt: 'Conteudo PT' },
      images: { pt: ['pt.jpg'] },
    });

    const result = await service.findEdificacaoById('4', 'es');

    expect(result).toEqual({
      nome: 'Titulo PT',
      endereco: 'Endereco PT',
      conteudo: 'Conteudo PT',
      midias: ['pt.jpg'],
    });
  });
});
