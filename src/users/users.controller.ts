import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserNewRequest } from './dto/create-user.dto.js';
import { JWTAuthGuard } from '../auth/guards/jwt.guard.js';
import type { TokenPayload } from '../auth/token-payload.interface.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/new')
  // @UseInterceptors(NoFilesInterceptor())
  createNewUser(@Body() newUser: UserNewRequest) {
    return this.usersService.createNewUser(newUser);
  }

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  getUserInfo(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
