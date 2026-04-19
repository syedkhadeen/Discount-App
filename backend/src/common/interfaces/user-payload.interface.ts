import { Role } from '../enums/roles.enum';

export interface UserPayload {
  sub: string;
  email: string;
  role: Role;
  restaurantId?: string;
}


