import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRewardDto } from './dto/create-reward.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: '보상 등록 (ADMIN, OPERATOR 전용)' })
  async create(@Body() createRewardDto: CreateRewardDto, @Request() req) {
    const allowedRoles = ['ADMIN', 'OPERATOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('관리자 또는 운영자만 등록할 수 있습니다.');
    }
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 보상 목록 조회 (ADMIN, AUDITOR 전용)' })
  async findAll(@Request() req) {
    const allowedRoles = ['ADMIN', 'AUDITOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.rewardsService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: '보상 이름으로 상세 조회 (ADMIN, AUDITOR 전용)' })
  async findManyByName(@Param('name') name: string, @Request() req) {
    const allowedRoles = ['ADMIN', 'AUDITOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return this.rewardsService.findManyByName(name);
  }
}
