import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { RewardConditionService } from './reward-condition.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

@ApiTags('Reward Condition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reward-condition')
export class RewardConditionController {
  constructor(private readonly service: RewardConditionService) {}

  @Post()
  @ApiOperation({ summary: '조건 결과 등록 (관리자·운영자만)' })
  @ApiBody({
    schema: {
      example: {
        userEmail: 'user@example.com',
        rewardName: '100 포인트',
        isSatisfied: true,
      },
    },
  })
  async set(
    @Body()
    body: { userEmail: string; rewardName: string; isSatisfied: boolean },
    @Request() req,
  ) {
    const allowedRoles = ['ADMIN', 'OPERATOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('관리자 또는 운영자만 등록할 수 있습니다.');
    }
    return this.service.setConditionStatus(
      body.userEmail,
      body.rewardName,
      body.isSatisfied,
    );
  }

  @Get('all')
  @ApiOperation({ summary: '전체 조건 상태 조회 (관리자·감시자만)' })
  async getAll(@Request() req) {
    const allowedRoles = ['ADMIN', 'AUDITOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.service.getAllStatus();
  }
}
