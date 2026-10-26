import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client.js';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface.js';
import { JwtService } from '@nestjs/jwt';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedException('Credentials are not valid');
      return user;
    } catch (e) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<ms.StringValue>('JWT_EXPIRATION')),
    );
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);

    this.adapterHost.httpAdapter.setCookie(response, 'Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
      path: '/',
    });
    return { tokenPayload };
  }
}
