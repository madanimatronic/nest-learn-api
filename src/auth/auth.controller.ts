import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUserAttributes } from 'src/users/types/user.types';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { type AuthRequest } from './types/request.types';
import { UserJwtPayload } from './types/user-jwt.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Req() req: AuthRequest<AuthenticatedUserAttributes>) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-jwt')
  testJwt(@Req() req: AuthRequest<UserJwtPayload>) {
    // TODO: убрать дублирование можно через middleware (изучить)
    if (!req.user) {
      throw new UnauthorizedException('User data error');
    }
    return req.user;
  }
}
