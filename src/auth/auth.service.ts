import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      await bcrypt.compare(user.password, password);
      return user;
    } catch (e) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }
}
