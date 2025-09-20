import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
