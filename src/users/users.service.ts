import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleToUserDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { User } from './models/user.model';
import { UserAttributes } from './types/user.types';

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

    await user.reload({
      include: { model: Role, through: { attributes: [] } },
    });

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

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      include: {
        model: Role,
        through: { attributes: [] },
      },
    });

    return user?.toJSON() as UserAttributes;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      include: {
        model: Role,
        through: { attributes: [] },
      },
    });

    return user?.toJSON() as UserAttributes;
  }

  async addRole(dto: AddRoleToUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByName(dto.role);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await user.$add('roles', role.id);

    await user.reload({
      include: { model: Role, through: { attributes: [] } },
    });

    return user.toJSON();
  }

  async setRoles(dto: SetUserRolesDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allRoles = await this.rolesService.getAllRoles();
    const filteredRoles = allRoles.filter((role) =>
      dto.roles.includes(role.name),
    );
    const filteredRoleIds = filteredRoles.map((role) => role.id);

    await user.$set('roles', filteredRoleIds);

    await user.reload({
      include: { model: Role, through: { attributes: [] } },
    });

    return user.toJSON();
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({ banned: true, banReason: dto.banReason });
    await user.reload({
      include: { model: Role, through: { attributes: [] } },
    });

    return user.toJSON();
  }

  async unban(userId: number) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({ banned: false, banReason: null });
    await user.reload({
      include: { model: Role, through: { attributes: [] } },
    });

    return user.toJSON();
  }
}
