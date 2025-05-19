import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { CreateRewardRequestDto } from './dto/reward-request.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

@ApiTags('Reward Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reward-requests')
export class RewardRequestsController {
  constructor(private readonly service: RewardRequestsService) {}

  @Post()
  @ApiOperation({ summary: '유저 보상 요청 (USER만 가능)' })
  async create(@Body() dto: CreateRewardRequestDto, @Request() req) {
    if (req.user.role !== 'USER') {
      throw new ForbiddenException('일반 유저만 보상을 요청할 수 있습니다.');
    }

    const userEmail = req.user.email;
    return this.service.create(dto, userEmail);
  }

  @Get()
  @ApiOperation({ summary: '전체 보상 요청 조회 (ADMIN, AUDITOR)' })
  @ApiQuery({
    name: 'eventName',
    required: false,
    description: '이벤트 이름',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '요청 상태 (SUCCESS | FAILED)',
  })
  async findAll(
    @Request() req,
    @Query('eventName') eventName?: string,
    @Query('status') status?: string,
  ) {
    const allowedRoles = ['ADMIN', 'AUDITOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return this.service.findAllWithFilter({ eventName, status });
  }

  @Get('me')
  @ApiOperation({
    summary: '내 보상 요청 조회 (USER만 가능-관리자 보상 요청 X)',
  })
  async findMyRequests(@Request() req) {
    return this.service.findByUser(req.user.email);
  }
}
