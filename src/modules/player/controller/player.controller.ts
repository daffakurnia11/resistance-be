import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { ApiBody } from '@nestjs/swagger';
import { JoinLobbyDto, LeaveLobbyDto } from '../dto/player.dto';
import { PlayerRevealDTO } from '../dto/player.reveal.dto';
import { PlayerAssignRoleDTO } from '../dto/player.assign.role.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('join')
  @ApiBody({ type: JoinLobbyDto })
  @UsePipes()
  async join(@Body() body: JoinLobbyDto) {
    try {
      return await this.playerService.join(body);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('leave')
  @ApiBody({ type: LeaveLobbyDto })
  @UsePipes()
  async leave(@Body() body: LeaveLobbyDto) {
    try {
      return await this.playerService.leave(body);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('kick')
  @ApiBody({ type: LeaveLobbyDto })
  @UsePipes()
  async kick(@Body() body: LeaveLobbyDto) {
    try {
      return await this.playerService.kick(body);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('assign')
  @ApiBody({ type: PlayerAssignRoleDTO })
  async assign(@Body() payload: PlayerAssignRoleDTO) {
    try {
      return await this.playerService.assign(payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('reveal')
  @ApiBody({ type: PlayerRevealDTO })
  async reveal(@Body() payload: PlayerRevealDTO) {
    try {
      return await this.playerService.reveal(payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
