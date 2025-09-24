import { RoleAttributes } from 'src/roles/types/role.types';

export interface UserJwtPayload {
  id: number;
  email: string;
  roles: RoleAttributes[];
  banned: boolean;
}
