import { Request } from 'express';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UserJwtPayload } from './user-jwt.types';

export interface AuthRequest<
  T extends AuthenticatedUserAttributes | UserJwtPayload =
    | AuthenticatedUserAttributes
    | UserJwtPayload,
> extends Request {
  user?: T;
}
