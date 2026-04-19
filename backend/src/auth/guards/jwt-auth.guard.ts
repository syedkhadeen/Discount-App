import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined =
      request.headers?.authorization || request.headers?.Authorization;
    const altHeader: string | undefined = request.headers?.['x-access-token'];

    if (!authHeader && !altHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const sourceHeader = authHeader || altHeader!;
    const [scheme, credentials] = String(sourceHeader).split(' ');
    const token = scheme?.toLowerCase() === 'bearer' ? credentials : sourceHeader;

    const primarySecret = process.env.JWT_SECRET;
    const fallbackSecret = 'dev_secret_change_me';

    const secretsToTry = [primarySecret, fallbackSecret].filter(
      (s): s is string => Boolean(s),
    );

    let lastError: any;
    for (const secret of secretsToTry) {
      try {
        const payload: any = this.jwtService.verify(token, { secret });
        request.user = {
          userId: payload.sub,
          id: payload.sub,
          email: payload.email,
          role: String(payload.role).toLowerCase(),
          ...(payload.restaurantId ? { restaurantId: payload.restaurantId } : {}),
        };
        // eslint-disable-next-line no-console
        console.log('[JwtAuthGuard] verified with secret:', secret === primarySecret ? 'env' : 'fallback');
        return true;
      } catch (error) {
        lastError = error;
        // If token expired, fail immediately; invalid signature will try next
        if (error?.name === 'TokenExpiredError') {
          break;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log('[JwtAuthGuard] verify failed:', lastError?.name, lastError?.message);
    throw new UnauthorizedException(
      lastError?.name === 'TokenExpiredError'
        ? 'Token expired'
        : 'Invalid or expired JWT',
    );
  }
}