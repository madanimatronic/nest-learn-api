import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { cookieExtractorWrapper } from 'src/utils/cookie-extractor.util';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/register-data.dto';
import { AccessJwtAuthGuard } from './guards/access-jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { type AuthRequest } from './types/request.types';
import { UserJwtPayload } from './types/user-jwt.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() userDto: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(userDto);

    this.setRefreshTokenCookie(tokens.refreshToken, res);

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: AuthRequest<AuthenticatedUserAttributes>,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    const tokens = await this.authService.login(req.user);

    this.setRefreshTokenCookie(tokens.refreshToken, res);

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: AuthRequest<AuthenticatedUserAttributes>,
    @Res({ passthrough: true }) res: Response,
  ) {
    // TODO: убрать дублирование можно через middleware (или guard наверное) (изучить)
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    const refreshToken = this.getRefreshTokenCookie(req)!;

    const refreshedTokens = await this.authService.refreshTokens(
      req.user,
      refreshToken,
    );

    this.setRefreshTokenCookie(refreshedTokens.refreshToken, res);

    return { accessToken: refreshedTokens.accessToken };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: AuthRequest<AuthenticatedUserAttributes>,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    await this.authService.logout(req.user.id);
    res.clearCookie('refresh_token');

    return { message: 'success' };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('test-jwt')
  testJwt(@Req() req: AuthRequest<UserJwtPayload>) {
    if (!req.user) {
      throw new UnauthorizedException('User data error');
    }
    return req.user;
  }

  private setRefreshTokenCookie(refreshToken: string, res: Response) {
    res.cookie('refresh_token', refreshToken, {
      maxAge: Number(this.configService.getOrThrow<string>('COOKIE_LIFETIME')),
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
    });
  }

  private getRefreshTokenCookie(req: AuthRequest<AuthenticatedUserAttributes>) {
    const cookieExtractor = cookieExtractorWrapper('refresh_token');
    return cookieExtractor(req);
  }
}
