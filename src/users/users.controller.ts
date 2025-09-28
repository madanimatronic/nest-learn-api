import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from 'src/auth/guards/access-jwt-auth.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { AddRoleToUserDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Можно и без async/await, если не нужно обрабатывать результат
  // Если возвращается promise, то Nest дождётся его выполнения, затем вернёт ответ
  // P.S. Здесь async просто для лучшего вида + в документации похожие примеры
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(AccessJwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Добавление одной роли' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/add-role')
  async addRole(
    @Param('id') userId: string,
    @Body() roleDto: Omit<AddRoleToUserDto, 'userId'>,
  ) {
    const dto = new AddRoleToUserDto({ userId: Number(userId), ...roleDto });
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Установка всех ролей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/set-roles')
  async setRoles(
    @Param('id') userId: string,
    @Body() rolesDto: Omit<SetUserRolesDto, 'userId'>,
  ) {
    const dto = new SetUserRolesDto({ userId: Number(userId), ...rolesDto });
    return this.usersService.setRoles(dto);
  }

  @ApiOperation({ summary: 'Бан пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/ban')
  async ban(
    @Param('id') userId: string,
    @Body() banDto: Omit<BanUserDto, 'userId'>,
  ) {
    const dto = new BanUserDto({ userId: Number(userId), ...banDto });
    return this.usersService.ban(dto);
  }

  @ApiOperation({ summary: 'Разбан пользователя' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/unban')
  async unban(@Param('id') userId: string) {
    return this.usersService.unban(Number(userId));
  }
}
