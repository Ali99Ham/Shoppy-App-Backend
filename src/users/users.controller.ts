import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserNewRequest } from './dto/create-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/new')
  createNewUser(@Body() newUser: UserNewRequest) {
    this.usersService.createNewUser(newUser);
  }
}
