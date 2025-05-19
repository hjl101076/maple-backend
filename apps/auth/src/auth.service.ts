import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, role?: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user.toObject();
      if (role && result.role !== role) {
        throw new UnauthorizedException('요청한 역할과 일치하지 않습니다.');
      }
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string, role: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersService.createUser(email, passwordHash, role);
  }
}
