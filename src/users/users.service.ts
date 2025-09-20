import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly rolesService: RolesService,
  ) {}

  // Некоторые методы возвращают "грязные" данные с лишними полями вроде _previousDataValues и т.п.
  // для чистых данных нужно использовать raw: true или другие способы
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByName('USER');
    if (!role) {
      throw new HttpException(
        'Role not found during user creation!',
        HttpStatus.NOT_FOUND,
      );
    }
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getUsers() {
    // Можно задать {include: {all: true}}, чтобы в ответе были все поля,
    // связанные с моделью пользователя или явно определить эти поля, например { include: Role }
    const users = await this.userRepository.findAll({
      include: {
        model: Role,
        // Отбрасывание UserRoles из ответа для чистоты
        through: { attributes: [] },
      },
      // Для удаления какого-то поля из ответа
      // attributes: { exclude: ['updatedAt'] },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      raw: true,
    });
    return user;
  }
}
