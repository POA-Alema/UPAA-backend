import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { CreateAdminUserDto } from '../dto/create-admin-user.dto';
import { UpdateAdminUserDto } from '../dto/update-admin-user.dto';
import { CurrentAdmin } from '../../auth/decorators/current-admin.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminRole } from '../../auth/constants/admin-role';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthenticatedAdmin } from '../../auth/types/authenticated-admin';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna informações do módulo administrativo' })
  index() {
    return { module: 'admin', status: 'ok' };
  }

  @Get('users')
  @ApiOperation({ summary: 'Lista administradores e gerenciadores de conteúdo' })
  findAllUsers() {
    return this.adminService.findAll();
  }

  @Post('users')
  @ApiOperation({ summary: 'Cria usuário administrativo' })
  createUser(@Body() dto: CreateAdminUserDto) {
    return this.adminService.create(dto);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Busca usuário administrativo por ID' })
  findOneUser(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualiza usuário administrativo' })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentAdmin() currentAdmin: AuthenticatedAdmin,
  ) {
    return this.adminService.update(id, dto, currentAdmin);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Remove usuário administrativo' })
  removeUser(@Param('id') id: string, @CurrentAdmin() currentAdmin: AuthenticatedAdmin) {
    return this.adminService.remove(id, currentAdmin);
  }
}
