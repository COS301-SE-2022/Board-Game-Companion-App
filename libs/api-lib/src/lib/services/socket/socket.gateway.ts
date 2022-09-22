import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({cors: true})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users = 0;

  async handleConnection(){
    this.users++;
    this.server.emit('users', this.users);
  }

  async handleDisconnect(){
    this.users--;
    this.server.emit('users', this.users);
  }

  async send(link:string,data:any){
    this.server.emit(link,data);
  }
}
  