import { Injectable } from '@nestjs/common';
import { UserNewRequest } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  createNewUser(newUser: UserNewRequest) {
    console.log('new user', newUser);
  }
}
