import {WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';

  @WebSocketGateway()
  export class AlertGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users = 0;

    async handleConnection(){
      this.users++;
      this.server.emit('users', this.users);
    }

    async handleDisconnect(){
      this.users--;
      this.server.emit('users', this.users);
    }

    @SubscribeMessage('alert')
    async alert(client, message) {
      client.broadcast.emit('alert', message);
    }
  }
  