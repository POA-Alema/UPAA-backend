import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpsertLandingPageDto } from '../dto/upsert-landing-page.dto';

@Injectable()
export class LandingPageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Valida a estrutura mínima da immigrationSection.
   * title.pt e content.pt são obrigatórios quando a seção está presente.
   * imageAlt é obrigatório quando imageURL está presente (acessibilidade).
   */
  private validateImmigrationSection(
    section: UpsertLandingPageDto['immigrationSection'],
  ): void {
    if (!section) return;

    if (!section.title?.pt) {
      throw new BadRequestException(
        'immigrationSection.title.pt é obrigatório',
      );
    }

    if (!section.content?.pt) {
      throw new BadRequestException(
        'immigrationSection.content.pt é obrigatório',
      );
    }

    // Validação de acessibilidade: imageAlt é obrigatório quando imageURL está presente
    if (section.imageURL && !section.imageAlt) {
      throw new BadRequestException(
        'immigrationSection.imageAlt é obrigatório quando imageURL está presente (acessibilidade)',
      );
    }
  }

  /**
   * Retorna o conteúdo público da landing page (primeiro registro).
   * Retorna null com segurança se não houver registro.
   */
  async findPublic() {
    const landingPage = await this.prisma.landingPage.findFirst();

    if (!landingPage) {
      return null;
    }

    return landingPage;
  }

  /**
   * Cria um novo registro de landing page.
   */
  async create(dto: UpsertLandingPageDto, updatedById: string) {
    this.validateImmigrationSection(dto.immigrationSection);

    const data: any = {
      ...(dto as any),
      updatedById,
    };

    return this.prisma.landingPage.create({
      data,
    });
  }

  /**
   * Atualiza um registro de landing page existente pelo ID.
   */
  async update(id: string, dto: UpsertLandingPageDto, updatedById: string) {
    const existing = await this.prisma.landingPage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(
        `Landing page com ID "${id}" não encontrada`,
      );
    }

    if (dto.immigrationSection !== undefined) {
      this.validateImmigrationSection(dto.immigrationSection);
    }

    const data: any = {
      ...(dto as any),
      updatedById,
    };

    return this.prisma.landingPage.update({
      where: { id },
      data,
    });
  }

  /**
   * Remove um registro de landing page pelo ID.
   */
  async remove(id: string) {
    const existing = await this.prisma.landingPage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(
        `Landing page com ID "${id}" não encontrada`,
      );
    }

    return this.prisma.landingPage.delete({
      where: { id },
    });
  }
}
