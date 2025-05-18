import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardRequestDto {
  @ApiProperty({
    description: '이벤트 이름',
    example: '출석 이벤트',
  })
  @IsString()
  eventName: string;

  @ApiProperty({
    description: '보상 이름',
    example: '100 포인트',
  })
  @IsString()
  rewardName: string;
}
