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
export class LobbyLogGateway {
  constructor(protected lobbyRepository: LobbyRepository) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('lobby_log')
  handlePlayerLog(
    @MessageBody() log: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(log);
    this.server.emit('lobby_log', log);
  }
}
