import { InferAttributes } from 'sequelize';
import { Role } from '../roles.model';

export type RoleAttributes = Omit<InferAttributes<Role>, 'users'>;
