import { Body, Controller, Post } from '@nestjs/common';
import { MissionService } from '../services/mission.service';
import { ApiBody } from '@nestjs/swagger';
import { MissionDTO } from '../dto/mission.dto';

@Controller({ path: 'mission' })
export class MissionController {
  constructor(protected readonly missionService: MissionService) {}

  @Post()
  @ApiBody({ type: MissionDTO })
  async create(@Body() payload: MissionDTO) {
    return await this.missionService.create(payload);
  }
}
