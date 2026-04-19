import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const userRoleValue = user?.role;
    if (!userRoleValue) {
      return false;
    }

    const userRoles = Array.isArray(userRoleValue)
      ? userRoleValue
      : [userRoleValue];

    const normalizedUserRoles = userRoles
      .filter((r) => r != null)
      .map((r) => String(r).toLowerCase());

    const normalizedRequired = requiredRoles.map((r) => String(r).toLowerCase());

    return normalizedRequired.some((required) =>
      normalizedUserRoles.includes(required),
    );
  }
}