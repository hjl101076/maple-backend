import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ForbiddenException,
  Param,
} from '@nestjs/common';
import { EventsService } from './cel.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '이벤트 등록 (ADMIN, OPERATOR만 가능)' })
  async create(@Body() dto: CreateEventDto, @Request() req) {
    const allowedRoles = ['ADMIN', 'OPERATOR'];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException('이벤트 등록 권한이 없습니다.');
    }

    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '전체 이벤트 목록 조회 (모든 사용자 가능)' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 상세 조회 (모든 사용자 가능)' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }
}
