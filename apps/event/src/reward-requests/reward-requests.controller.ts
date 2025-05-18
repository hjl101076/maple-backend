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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('reward-requests')
export class RewardRequestsController {
  constructor(private readonly service: RewardRequestsService) {}

  @Post()
  @ApiOperation({ summary: '유저 보상 요청' })
  async create(@Body() dto: CreateRewardRequestDto, @Request() req) {
    const userEmail = req.user.email;
    return this.service.create(dto, userEmail);
  }

  @Get()
  @ApiOperation({ summary: '전체 보상 요청 조회 (권한자만)' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID 필터' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '요청 상태 (SUCCESS | FAILED)',
  })
  async findAll(
    @Request() req,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ) {
    const allowedRoles = ['ADMIN', 'OPERATOR', 'AUDITOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return this.service.findAllWithFilter({ eventId, status });
  }

  @Get('me')
  @ApiOperation({ summary: '내 보상 요청 조회 (jwt인증 값으로로 조회)' })
  async findMyRequests(@Request() req) {
    return this.service.findByUser(req.user.email);
  }
}
