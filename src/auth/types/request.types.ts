import { Request } from 'express';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UserJwtPayload } from './user-jwt.types';

export interface AuthRequest<
  T extends AuthenticatedUserAttributes | UserJwtPayload | undefined =
    | AuthenticatedUserAttributes
    | UserJwtPayload
    | undefined,
> extends Request {
  user: T;
}
