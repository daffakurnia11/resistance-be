import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { LobbyService } from '../service/lobby.service';
import { LobbyDto } from '../dto/lobby.dto';

@Controller({
  path: 'lobbies',
})
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  @ApiBody({ type: LobbyDto })
  async create(@Body() body: LobbyDto) {
    return await this.lobbyService.create(body);
  }

  @Post('join')
  join() {
    return 'test';
  }
}
