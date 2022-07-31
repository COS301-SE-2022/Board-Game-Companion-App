import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminComponent } from './admin.component';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { of } from 'rxjs';
import { script } from '../../shared/models/script';
import { FormsModule } from '@angular/forms';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let service: AdminService;
  let router: Router;
  // let route: ActivatedRoute;
  let httpTestingController: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [AdminService],
      imports: [HttpClientTestingModule,RouterTestingModule,NgxPaginationModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    component.scripts = [];
    fixture.detectChanges();
    service = TestBed.inject(AdminService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const Response: script[] = [{
      _id: "2",
      name: "tictactoe",
      author: {name:"Njabulo",email:"jsjs@gmail.com"},
      owner: {name:"",email:""},
      boardgame: "",
      description: "",
      created: new Date("05-03-19"),
      release: new Date("15-08-19"),
      downloads: 500,
      lastdownload: new Date("05-07-22"),
      lastupdate: new Date("13-12-21"),
      public: true,
      export: false,
      size: 344,
      status: {value: 1, message: "Active and running"},
      comments: [],
      source: {name:"",location:"",awsKey:""},
      build: {name:"",location:"",awsKey:""},
      icon: {name:"",location:"",awsKey:""},
      __v: 0
    },{
      _id: "1",
      name: "chess",
      author: {name:"PRO",email:"kid@yahoo.com"},
      owner: {name:"",email:""},
      boardgame: "",
      description: "",
      created: new Date(0),
      release: new Date(0),
      downloads: 32,
      lastdownload: new Date(0),
      lastupdate: new Date(0),
      public: false,
      export: false,
      size: 233,
      status: {value: 0, message: "flagged"},
      comments: [],
      source: {name:"",location:"",awsKey:""},
      build: {name:"",location:"",awsKey:""},
      icon: {name:"",location:"",awsKey:""},
      __v: 0
    },{
      _id: "3",
      name: "root",
      author: {name:"Master",email:"masterInd@gmail.com"},
      owner: {name:"",email:""},
      boardgame: "",
      description: "",
      created: new Date("01-04-20"),
      release: new Date("13-09-20"),
      downloads: 0,
      lastdownload: new Date("07-07-22"),
      lastupdate: new Date("12-10-21"),
      public: false,
      export: false,
      size: 320,
      status: {value: 2, message: "In progress"},
      comments: [],
      source: {name:"",location:"",awsKey:""},
      build: {name:"",location:"",awsKey:""},
      icon: {name:"",location:"",awsKey:""},
      __v: 0
    }];

    it('should load all scripts when ngOnInit()', ()=>{
      jest.spyOn(service,'getScripts'); //Spy when it's called
      
      expect(component.scripts).toStrictEqual([]);

      component.ngOnInit();

      expect(service.getScripts).toBeCalledTimes(1);
     
      expect(component.scripts).toBeTruthy();

      fixture.detectChanges();

      const req = httpTestingController.match('http://localhost:3333/api/scripts/retrieve/all');
      expect(req[0].request.method).toBe('GET');
      req[0].flush(Response);

      fixture.detectChanges();

      const Scripts = fixture.nativeElement.querySelectorAll('tr');
      expect(Scripts.length-1).toEqual(Response.length); //minus first row

      const navigateSpy = jest.spyOn(router,'navigate');

      const btnEdit = fixture.nativeElement.querySelector('.btn-success');
      btnEdit.click();
      
      expect(navigateSpy).toBeCalled();
    });

});
