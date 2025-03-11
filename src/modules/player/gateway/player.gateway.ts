import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyRepository } from '../../lobby/repository/lobby.repository';

@WebSocketGateway({ cors: { origin: '*' } })
export class PlayerGateway {
  constructor(protected lobbyRepository: LobbyRepository) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('player_join')
  async handlePlayerJoin(
    @MessageBody() room_code: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(room_code);
    const lobby = await this.lobbyRepository.getWithPlayer(room_code);
    this.server.to(room_code).emit('player_update', lobby);
  }

  @SubscribeMessage('lobby_log')
  handlePlayerLog(
    @MessageBody() log: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(log);
    this.server.emit('lobby_log', log);
  }
}
