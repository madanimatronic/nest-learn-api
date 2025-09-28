import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/auth/types/request.types';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Используется в паре с каким-нибудь guard'ом авторизации
// Предварительно нужно задать роли декоратором @Roles
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    // Дополнительная защита на случай непредвиденных ошибок, т.к.
    // user.roles должен быть, если есть user
    if (!user.roles) {
      throw new UnauthorizedException('No user roles provided');
    }

    return user.roles.some((role) => requiredRoles.includes(role.name));
  }
}
