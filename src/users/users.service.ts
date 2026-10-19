import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserNewRequest } from './dto/create-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { User } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createNewUser(newUser: UserNewRequest) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: newUser.email,
          password: await bcrypt.hash(newUser.password, 10),
        },
        select: {
          email: true,
          id: true,
        },
      });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'P2002')
        throw new UnprocessableEntityException('Email already exists');
      throw err;
    }
  }
}
