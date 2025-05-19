import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입 (역할 포함 가능)' })
  @ApiBody({ type: LoginDto })
  async register(@Body() body: LoginDto) {
    const role = body.role ?? 'USER'; // role이 없으면 기본 USER
    return this.authService.register(body.email, body.password, role);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 및 JWT 발급' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
      body.role,
    );
    return this.authService.login(user);
  }
}
