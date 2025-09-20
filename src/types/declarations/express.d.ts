import { User } from 'src/users/models/user.model';

declare module 'express' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}
