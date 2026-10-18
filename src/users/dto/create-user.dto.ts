import { IsEmail, IsStrongPassword } from 'class-validator';

export class UserNewRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
