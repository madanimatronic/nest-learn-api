import { RoleAttributes } from 'src/roles/types/role.types';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UserJwtPayload } from '../types/user-jwt.types';

export class UserJwtPayloadDto implements UserJwtPayload {
  readonly id: number;
  readonly email: string;
  readonly roles: RoleAttributes[];
  readonly banned: boolean;

  constructor(user: AuthenticatedUserAttributes | UserJwtPayload) {
    this.id = user.id;
    this.email = user.email;
    this.roles = user.roles;
    this.banned = user.banned;
  }
}
