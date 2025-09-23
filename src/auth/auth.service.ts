import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UsersService } from 'src/users/users.service';
import { UserJwtPayloadDto } from './dto/user-jwt-payload.dto';

// TODO: реализовать refresh и refresh токены, сохранять refresh токены в БД
// (whitelist, чтобы при логауте нельзя было использовать refresh токен)
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: AuthenticatedUserAttributes) {
    const payload = new UserJwtPayloadDto(user);

    return { accessToken: this.jwtService.sign({ ...payload }) };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
