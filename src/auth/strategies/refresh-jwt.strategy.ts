import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { cookieExtractorWrapper } from 'src/utils/cookie-extractor.util';
import { UserJwtPayloadDto } from '../dto/user-jwt-payload.dto';
import { JwtPayload } from '../types/jwt.types';
import { UserJwtPayload } from '../types/user-jwt.types';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractorWrapper('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  validate(payload: JwtPayload<UserJwtPayload>) {
    return { ...new UserJwtPayloadDto(payload) };
  }
}
