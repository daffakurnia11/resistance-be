import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { LobbyRepository } from '@src/modules/lobby/repository/lobby.repository';
import { EventBus } from '@nestjs/cqrs';
import { PlayerJoinDTO, PlayerRoomRole } from '../dto/player.dto';
import { v7 as uuidv7 } from 'uuid';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import { PlayerJoinAndUpdateEvent } from '../events/player.join.and.update.event.handler';

@Injectable()
export class PlayerJoinManager {
  constructor(
    protected readonly playerRepository: PlayerRepository,
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(payload: PlayerJoinDTO) {
    const lobby = await this.lobbyRepository.findOne(payload.room_code);
    const playerCount = await this.playerRepository.countPlayerInLobby(
      lobby.id,
    );
    if (playerCount > 5) {
      throw new BadRequestException('Oops! The lobby has been full.');
    }

    const playerId = uuidv7();
    const player = await this.playerRepository.create({
      id: playerId,
      name: payload.name,
      lobby_id: lobby.id,
      room_role: PlayerRoomRole.MEMBER,
    });

    const events = [
      new PlayerJoinAndUpdateEvent(payload.room_code),
      new LobbyLogEvent({
        action: LobbyLogAction.JOIN,
        lobby_id: lobby.id,
        player_id: playerId,
      }),
    ];

    this.eventBus.publishAll(events);

    return Promise.resolve({ lobby, player });
  }
}
