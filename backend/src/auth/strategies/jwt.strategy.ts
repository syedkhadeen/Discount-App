import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secretSource = process.env.JWT_SECRET ? 'env' : 'fallback';
    // eslint-disable-next-line no-console
    console.log(`[JwtStrategy] secret source: ${secretSource}`);
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          try {
            const bearer = (req?.headers as any)?.authorization || (req?.headers as any)?.Authorization;
            const alt = (req?.headers as any)?.['x-access-token'];
            let token: string | undefined;
            if (typeof bearer === 'string') {
              const [scheme, credentials] = bearer.split(' ');
              token = scheme?.toLowerCase() === 'bearer' ? credentials : bearer;
            }
            token = token || (typeof alt === 'string' ? alt : undefined);
            if (token) {
              // eslint-disable-next-line no-console
              console.log('[JwtStrategy] token extracted, length:', token.length);
            } else {
              // eslint-disable-next-line no-console
              console.log('[JwtStrategy] no token in headers');
            }
            return token;
          } catch {
            return undefined;
          }
        },
        (req: Request) => {
          // Try to read from cookie set by NextAuth/session if forwarded
          const cookieToken = (req?.cookies as any)?.['next-auth.session-token']
            || (req?.cookies as any)?.['__Secure-next-auth.session-token']
            || undefined;
          if (cookieToken) {
            // eslint-disable-next-line no-console
            console.log('[JwtStrategy] token from cookie, length:', cookieToken.length);
          }
          return cookieToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret_change_me',
    });
  }

  async validate(payload: UserPayload) {
    // Make sure role is normalized to lowercase for guards
    const normalizedRole = (payload as any)?.role?.toString?.().toLowerCase?.() ?? payload.role;
    return { userId: payload.sub, email: payload.email, role: normalizedRole } as any;
  }
}