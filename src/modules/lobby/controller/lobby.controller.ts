import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { LobbyService } from '../service/lobby.service';
import { CreateLobbyDTO } from '../dto/lobby.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  @ApiBody({ type: CreateLobbyDTO })
  @UsePipes()
  async create(@Body() body: CreateLobbyDTO) {
    try {
      return await this.lobbyService.create(body.name);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get(':room_code')
  async get(@Param('room_code') room_code: string) {
    try {
      return await this.lobbyService.get(room_code);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.lobbyService.delete(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
