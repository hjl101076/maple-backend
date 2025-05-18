import { IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: '이벤트 이름', example: '출석 이벤트' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '이벤트 설명',
    example: '3일 연속 로그인 시 포인트 지급',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: '이벤트 조건', example: '로그인 3일' })
  @IsString()
  condition: string;

  @ApiProperty({ description: '시작 날짜', example: '2025-05-16T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '종료 날짜', example: '2025-06-16T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: '활성 여부', example: true })
  @IsBoolean()
  isActive: boolean;
}
