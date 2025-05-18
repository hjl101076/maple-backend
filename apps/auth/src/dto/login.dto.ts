// dto/login.dto.ts
import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password1234' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'USER || ADMIN ||  OPERATOR',
    description: '회원가입 시에만 사용 (USER | ADMIN | OPERATOR)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['USER', 'ADMIN', 'OPERATOR'])
  role?: string;
}
