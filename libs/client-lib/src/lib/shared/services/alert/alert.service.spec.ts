import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from './alert.service';
import { SocketIoModule } from 'ngx-socket-io';
import { take } from 'rxjs/operators';
// import { alert } from '../../models/alert/alert';

/************* INTEGRATION TESTS ****************/
describe('Test service',()=>{

  let service: AlertService;
  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientModule,SocketIoModule.forRoot({ url: 'http://localhost:3333/api', options: { transports: ['websocket'], reconnection: true } })],
    providers:[AlertService]});
    service = TestBed.inject(AlertService);
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

  it('should return an array of size 0 or greater',(done)=>{
    window.sessionStorage.setItem('name','Matome Makgopa');
    window.sessionStorage.setItem('email','matomemakgopa64@gmail.com');
    service.getAllUserMessages().pipe(take(1)).subscribe(data=>{
      expect(data.length).toBeGreaterThanOrEqual(0);
      if(data.length!==0)
        service.markAsRead(data[0]._id).subscribe(val=>{
          expect(val).toBeTruthy();
        });
      done();
    }
    );
  });

  it('should post an alert and return it',(done)=>{
    window.sessionStorage.setItem('name','Matome Makgopa');
    window.sessionStorage.setItem('email','matomemakgopa64@gmail.com');
    service.getAllUnReadUserMessages().subscribe(Alert=>{
      expect(Alert).toBeDefined();
      done();
    });
  });

});