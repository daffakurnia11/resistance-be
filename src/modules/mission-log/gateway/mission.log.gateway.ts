import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class MissionLogGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('mission_log')
  handlePlayerLog(
    @MessageBody() log: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(log);
    this.server.emit('mission_log', log);
  }
}
