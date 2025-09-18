import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  // Nest-CLI генерирует просто с private, без readonly.
  // Если вдруг будут проблемы с этим - убрать readonly
  constructor(private readonly roleService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @ApiOperation({ summary: 'Получение роли по названию' })
  @ApiResponse({ status: 200, type: Role })
  @Get(':roleName')
  async getByName(@Param('roleName') roleName: string) {
    return this.roleService.getRoleByName(roleName);
  }
}
