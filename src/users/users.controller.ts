import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @Get()
  async getAll() {
    return this.usersService.getUsers();
  }
}
