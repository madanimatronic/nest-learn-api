import { Role } from 'src/roles/roles.model';
import { User } from '../models/user.model';
import {
  AuthenticatedUserAttributes,
  UserAttributes,
} from '../types/user.types';

export class AuthenticatedUserDto implements AuthenticatedUserAttributes {
  public readonly id: number;
  public readonly email: string;
  public readonly banned: boolean;
  public readonly banReason: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly roles: Role[];

  constructor(user: UserAttributes | User) {
    this.id = user.id;
    this.email = user.email;
    this.banned = user.banned;
    this.banReason = user.banReason;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roles = user.roles;
  }
}
