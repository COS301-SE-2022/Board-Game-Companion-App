import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { SocketIoModule } from 'ngx-socket-io';

describe('Test service',()=>{
  let service: AdminService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule,SocketIoModule.forRoot({ url: 'https://board-game-companion-app.herokuapp.com/api/', options: { transports: ['websocket'], reconnection: true } })],providers:[AdminService]});
    service = TestBed.inject(AdminService);
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

});