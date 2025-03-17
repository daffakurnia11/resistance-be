import { Body, Controller, Param, Post } from '@nestjs/common';
import { MissionService } from '../services/mission.service';
import { ApiBody } from '@nestjs/swagger';
import { MissionDTO } from '../dto/mission.dto';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionVoteDTO } from '../dto/mission.vote.dto';

@Controller({ path: 'mission' })
export class MissionController {
  constructor(protected readonly missionService: MissionService) {}

  @Post()
  @ApiBody({ type: MissionDTO })
  async create(@Body() payload: MissionDTO) {
    try {
      return await this.missionService.create(payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post(':missionId/assign')
  @ApiBody({ type: MissionAssignDTO })
  async assign(
    @Param('missionId') missionId: string,
    @Body() payload: MissionAssignDTO,
  ) {
    try {
      return await this.missionService.assignPlayers(missionId, payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post(':missionId/vote')
  @ApiBody({ type: MissionVoteDTO })
  async vote(
    @Param('missionId') missionId: string,
    @Body() payload: MissionVoteDTO,
  ) {
    try {
      return await this.missionService.vote(missionId, payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
