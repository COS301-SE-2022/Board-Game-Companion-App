import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({cors: true})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users = 0;
  loggedInUsers = 0;

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

  getUsers(): number{
    return this.users;
  }

  getLoggedInUsers(): number{
    return this.loggedInUsers;
  }

  @SubscribeMessage('login')
  async newLogIn(client, message) {
    this.loggedInUsers++;
    this.server.emit('login-count',this.loggedInUsers);
  }

  @SubscribeMessage('logout')
  async newLogOut(client, message) {
    this.loggedInUsers--;
    this.server.emit('logout-count',this.loggedInUsers)
  }
}
  