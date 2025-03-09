import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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

  @Get(':room_code')
  async get(@Param('room_code') room_code: string) {
    return await this.lobbyService.get({ room_code });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.lobbyService.delete({ id });
  }
}
