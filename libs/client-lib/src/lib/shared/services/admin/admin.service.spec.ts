import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from './admin.service';
import { SocketIoModule } from 'ngx-socket-io';
import { moderator } from '../../models/admin/moderator';

/****************************** Integration Tests ****************************************************/

describe('Test service should integrate with backend',()=>{
  let service: AdminService;
  let newAdmin: moderator={
    _id: '',
    email: '',
    admin: true,
}
  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientModule,SocketIoModule.forRoot({ url: 'https://board-game-companion-app.herokuapp.com', options: { transports: ['websocket'], reconnection: true } })],providers:[AdminService]});
    service = TestBed.inject(AdminService);
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

  describe('create an Admin',()=>{
    it('create system Admin',(done)=>{
      service.create('QabaNjabulo@gmail.com').subscribe((res)=>{
        expect(res).resolves;
        newAdmin = res;
        expect(res).toStrictEqual(newAdmin);
        done();
      });
    });
  });

  describe('warn an Account holder',()=>{
    it('warn',(done)=>{
      service.warn({name:'Bra Spike',email:'GeorgieZamdela@gmail.com'},'Please stop this lifestyle').subscribe(()=>{
        done();
      });
    });
  });

  describe('is the user banned?',()=>{
    it('should not be banned',(done)=>{
      window.sessionStorage.setItem('name','Njabulo');
      window.sessionStorage.setItem('email','MyEmai@gmail.com');
      service.banned().subscribe((res)=>{
        expect(res).toBeFalsy();
        done();
      });
    });
  });

  describe('is the user an Admin',()=>{
    it('should verify if isAdmin',(done)=>{
      window.sessionStorage.setItem('email',newAdmin.email);
      service.isAdmin().subscribe((res)=>{
        expect(res).toBeTruthy();
        done();
      });
    });
  });
  describe('delete an Admin',()=>{
    it('return deleted Admin',(done)=>{
      service.remove(newAdmin._id).subscribe((res)=>{
        expect(res._id).toBe(newAdmin._id);
        done();
      });
    });
  });

  describe('Count Downloaders',()=>{
    it('should return a number',(done)=>{
      service.countDownloaders().subscribe((res)=>{
        expect(res).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

  describe('count Collections Owners',()=>{
    it('should return a count',(done)=>{
      service.countCollectionOwners().subscribe((res)=>{
        expect(res).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

    describe('Total Accounts',()=>{
    it('should count total Accounts',(done)=>{
      service.getTotalAccounts().subscribe((res)=>{
        expect(res).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

  describe('Initial Logged Users',()=>{
    it('should count Logged',(done)=>{
      service.getInitialLoggedUsers().subscribe((res)=>{
        expect(res).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

  describe('Initial Active Accounts',()=>{
    it('should count active ones',(done)=>{
      service.getInitialActiveAccounts().subscribe((res)=>{
        expect(res).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });
});