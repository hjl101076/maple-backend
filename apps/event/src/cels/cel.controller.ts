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
  @ApiOperation({ summary: '이벤트 등록 (관리자만 가능)' })
  async create(@Body() dto: CreateEventDto, @Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('관리자만 이벤트를 등록할 수 있습니다.');
    }

    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '전체 이벤트 목록 조회' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 상세 조회' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }
}
