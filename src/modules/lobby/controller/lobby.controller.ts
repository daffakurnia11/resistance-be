import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { LobbyService } from '../service/lobby.service';
import { CreateLobbyDto, JoinLobbyDto } from '../dto/lobby.dto';

@Controller({
  path: 'lobbies',
})
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  @ApiBody({ type: CreateLobbyDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() body: CreateLobbyDto) {
    return await this.lobbyService.create(body);
  }

  @Post('join')
  @ApiBody({ type: JoinLobbyDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async join(@Body() body: JoinLobbyDto) {
    return await this.lobbyService.join(body);
  }

  @Get()
  async get(@Query('room_code') room_code: string) {
    return await this.lobbyService.get({ room_code });
  }
}
