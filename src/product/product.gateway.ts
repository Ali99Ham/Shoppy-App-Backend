import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';

@WebSocketGateway(3001, { cors: { credentials: true, origin: '*' } })
export class ProductGateway implements OnGatewayConnection {
  @WebSocketServer() private readonly server: Server;

  constructor(private readonly authService: AuthService) {}
  handleProductUpdated() {
    this.server.emit('ProductUpdated');
  }

  handleConnection(client: Socket) {
    try {
      this.authService.verifyToken(client.handshake.auth.Authentication.value);
    } catch (e) {
      throw new WsException('user is not authenticated');
    }
  }
}
