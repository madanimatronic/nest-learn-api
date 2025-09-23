import { RoleAttributes } from 'src/roles/types/role.types';

export interface UserJwtPayload {
  readonly id: number;
  readonly email: string;
  readonly roles: RoleAttributes[];
  readonly banned: boolean;
}
