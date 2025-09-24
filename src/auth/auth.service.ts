import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { AuthenticatedUserDto } from 'src/users/dto/authenticated-user.dto';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { UsersService } from 'src/users/users.service';
import { UserRegisterDto } from './dto/register-data.dto';
import { UserJwtPayloadDto } from './dto/user-jwt-payload.dto';
import { RefreshTokens } from './models/refresh-tokens.model';
import { UserJwtPayload } from './types/user-jwt.types';

// TODO: реализовать access и refresh токены, сохранять refresh токены в БД
// (whitelist, чтобы при логауте нельзя было использовать refresh токен)
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshTokens)
    private readonly refreshTokensRepository: typeof RefreshTokens,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(userDto: UserRegisterDto) {
    const newUser = await this.userService.createUser(userDto);

    const authenticatedUserData = new AuthenticatedUserDto(newUser);

    return this.login(authenticatedUserData);
  }

  async login(user: AuthenticatedUserAttributes) {
    const payload = new UserJwtPayloadDto(user);

    const tokens = this.generateTokens({ ...payload });

    await this.refreshTokensRepository.create({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user && user.password === pass) {
      const result = new AuthenticatedUserDto(user);

      return { ...result };
    }

    return null;
  }

  // user здесь не обязателен, от него достаточно только id, который можно получить из токена,
  // но в контроллере user всё равно присутствует (достаётся из payload),
  // поэтому нет смысла ещё раз доставать его из токена
  async refreshTokens(user: AuthenticatedUserAttributes, refreshToken: string) {
    const tokenFromDb = await this.refreshTokensRepository.findOne({
      where: { refreshToken: refreshToken },
    });

    if (!tokenFromDb) {
      throw new UnauthorizedException('Forbidden refresh token');
    }

    const freshUserData = await this.userService.getUserById(user.id);

    const payload = new UserJwtPayloadDto(freshUserData);

    const tokens = this.generateTokens({ ...payload });

    await this.refreshTokensRepository.update(
      { refreshToken: tokens.refreshToken },
      { where: { refreshToken: refreshToken } },
    );

    return tokens;
  }

  async logout(userId: number) {
    await this.refreshTokensRepository.destroy({ where: { userId: userId } });
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
