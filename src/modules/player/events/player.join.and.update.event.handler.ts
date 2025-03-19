import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LobbyRepository } from '../../lobby/repository/lobby.repository';
import { PlayerGateway } from '../gateway/player.gateway';

export class PlayerJoinAndUpdateEvent {
  constructor(public roomCode: string) {}
}

@EventsHandler(PlayerJoinAndUpdateEvent)
export class PlayerJoinAndUpdateEventHandler
  implements IEventHandler<PlayerJoinAndUpdateEvent>
{
  constructor(
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly playerGateway: PlayerGateway,
  ) {}

  async handle(event: PlayerJoinAndUpdateEvent) {
    const { roomCode } = event;
    const updatedLobby = await this.lobbyRepository.getWithPlayer(roomCode);
    this.playerGateway.server.emit('player_join', roomCode);
    this.playerGateway.server.emit('player_update', updatedLobby);
  }
}
