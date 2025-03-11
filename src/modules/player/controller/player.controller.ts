import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { ApiBody } from '@nestjs/swagger';
import { JoinLobbyDto, LeaveLobbyDto } from '../dto/player.dto';

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
}
