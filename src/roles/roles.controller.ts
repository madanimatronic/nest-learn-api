import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from 'src/auth/guards/access-jwt-auth.guard';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  // Nest-CLI генерирует просто с private, без readonly.
  // Если вдруг будут проблемы с этим - убрать readonly
  constructor(private readonly roleService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 201, type: Role })
  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({ status: 200, type: [Role] })
  // TODO: по-хорошему нужно избавиться от магических строк
  // и прочих магических значений
  @Roles('ADMIN')
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @Get()
  async getAll() {
    return this.roleService.getAllRoles();
  }

  @ApiOperation({ summary: 'Получение роли по названию' })
  @ApiResponse({ status: 200, type: Role })
  @Get(':roleName')
  async getByName(@Param('roleName') roleName: string) {
    return this.roleService.getRoleByName(roleName);
  }
}
