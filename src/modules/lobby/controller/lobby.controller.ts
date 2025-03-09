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
import { CreateLobbyDto } from '../dto/lobby.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  @ApiBody({ type: CreateLobbyDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() body: CreateLobbyDto) {
    return await this.lobbyService.create(body);
  }

  @Get()
  async get(@Query('room_code') room_code: string) {
    return await this.lobbyService.get({ room_code });
  }
}
