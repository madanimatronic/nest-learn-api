import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByName(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    return role;
  }
}
