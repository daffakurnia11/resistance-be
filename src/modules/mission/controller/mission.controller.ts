import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MissionService } from '../services/mission.service';
import { ApiBody } from '@nestjs/swagger';
import { MissionStartDTO } from '../dto/mission.dto';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionVoteDTO } from '../dto/mission.vote.dto';

@Controller({ path: 'mission' })
export class MissionController {
  constructor(protected readonly missionService: MissionService) {}

  @Post()
  @ApiBody({ type: MissionStartDTO })
  async create(@Body() payload: MissionStartDTO) {
    try {
      return await this.missionService.create(payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get(':missionId')
  async get(@Param('missionId') missionId: string) {
    try {
      return await this.missionService.getOneById(missionId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get(':missionId/result')
  async getResult(@Param('missionId') missionId: string) {
    try {
      return await this.missionService.getResult(missionId);
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
