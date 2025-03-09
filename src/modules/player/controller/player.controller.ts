import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { ApiBody } from '@nestjs/swagger';
import { JoinLobbyDto, LeaveLobbyDto } from '../dto/player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('join')
  @ApiBody({ type: JoinLobbyDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async join(@Body() body: JoinLobbyDto) {
    try {
      return await this.playerService.join(body);
    } catch (err) {
      console.error(err);
    }
  }

  @Post('leave')
  @ApiBody({ type: LeaveLobbyDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async leave(@Body() body: LeaveLobbyDto) {
    return await this.playerService.leave(body);
  }
}
