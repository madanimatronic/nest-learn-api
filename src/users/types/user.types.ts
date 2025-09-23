import { InferAttributes } from 'sequelize';
import { User } from '../models/user.model';

export type UserAttributes = InferAttributes<User>;

export type AuthenticatedUserAttributes = Omit<
  InferAttributes<User>,
  'password'
>;
