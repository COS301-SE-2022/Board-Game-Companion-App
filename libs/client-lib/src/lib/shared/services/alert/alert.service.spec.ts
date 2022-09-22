import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from './alert.service';
import { SocketIoModule } from 'ngx-socket-io';
// import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
// import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';


describe('Test service',()=>{

  let service: AlertService;
  // const IO_CONFIG:SocketIoConfig = {url:'http://localhost:3000,options:{}}
  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule,SocketIoModule.forRoot({ url: 'http://localhost:3333/api', options: { transports: ['websocket'], reconnection: true } })],
    providers:[AlertService]});
    service = TestBed.inject(AlertService);
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

});