import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyRepository } from '../repository/lobby.repository';

@WebSocketGateway({ cors: { origin: '*' } })
export class LobbyGateway {
  constructor(protected lobbyRepository: LobbyRepository) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_lobby')
  async handleJoinLobby(
    @MessageBody() room_code: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(room_code);
    const lobby = await this.lobbyRepository.getWithPlayer({
      room_code,
    });
    this.server.to(room_code).emit('lobby_update', lobby);
  }
}
