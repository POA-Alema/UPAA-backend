import { PartialType } from '@nestjs/swagger';
import { CreateArchitectDto } from './create-architect.dto';

export class UpdateArchitectDto extends PartialType(CreateArchitectDto) {}
