import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UsersService } from 'src/users/users.service';
import { UserJwtPayloadDto } from './dto/user-jwt-payload.dto';
import { UserJwtPayload } from './types/user-jwt.types';

// TODO: реализовать refresh и refresh токены, сохранять refresh токены в БД
// (whitelist, чтобы при логауте нельзя было использовать refresh токен)
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  login(user: AuthenticatedUserAttributes) {
    const payload = new UserJwtPayloadDto(user);

    const tokens = this.generateTokens({ ...payload });

    return tokens;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  refreshTokens(user: AuthenticatedUserAttributes, refreshToken: string) {
    // TODO: добавить логику работы с БД (удаление этого токена и добавление нового)
    const payload = new UserJwtPayloadDto(user);

    const tokens = this.generateTokens({ ...payload });

    return tokens;
  }

  private generateTokens(payload: UserJwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_LIFETIME',
        ),
      }),
    };
  }
}
