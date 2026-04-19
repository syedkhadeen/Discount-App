import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const normalizedRole = ((registerDto as any).role ?? Role.USER) as Role;
    const user = await this.usersService.create({
      ...registerDto,
      role: normalizedRole,
    });
    const userId = (user as any)._id?.toString?.() ?? (user as any).id ?? (user as any).userID;
    const payload: any = { email: user.email, sub: userId, role: String(user.role).toLowerCase() };
    if ((user as any).restaurantId) {
      payload.restaurantId = (user as any).restaurantId?.toString?.() ?? (user as any).restaurantId;
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: String(user.role).toLowerCase(),
        ...(payload.restaurantId ? { restaurantId: payload.restaurantId } : {}),
      },
    };
  }

  async login(loginDto: LoginDto) {
    console.log('[AuthService] loginDto.email:', loginDto.email);
    const user = await this.usersService.findByEmail(loginDto.email);
    console.log('[AuthService] user from DB:', user);
    const userId = user ? ((user as any)._id?.toString?.() ?? (user as any).id ?? (user as any).userID) : undefined;

    // Use whichever field is present
    const hash = user ? ((user as any).password || (user as any).passwordHash) : undefined;

    if (!user || !hash || !(await bcrypt.compare(loginDto.password, hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: any = { email: user.email, sub: userId, role: String(user.role).toLowerCase() };
    if ((user as any).restaurantId) {
      payload.restaurantId = (user as any).restaurantId?.toString?.() ?? (user as any).restaurantId;
    }
    // eslint-disable-next-line no-console
    console.log('[AuthService] signing JWT with secret source:', (process.env.JWT_SECRET ? 'env' : 'fallback'));
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: String(user.role).toLowerCase(),
        ...(payload.restaurantId ? { restaurantId: payload.restaurantId } : {}),
      },
    };
  }
}