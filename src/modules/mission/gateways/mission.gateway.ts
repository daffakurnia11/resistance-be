import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MissionRelationed } from '../types/mission.type';

@WebSocketGateway({ cors: { origin: '*' } })
export class MissionGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('mission_updated')
  handlePlayerLog(
    @MessageBody() mission: MissionRelationed,
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(JSON.stringify(mission));
    this.server.emit('mission_updated', JSON.stringify(mission));
  }
}
