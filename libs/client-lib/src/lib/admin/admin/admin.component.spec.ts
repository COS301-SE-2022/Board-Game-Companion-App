import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminComponent } from './admin.component';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { report } from '../../shared/models/scripts/report';
import { ReportService } from '../../shared/services/reports/report.service';
import { myScript } from '../../shared/models/scripts/my-script';
// import { script } from '../../shared/models/scripts/script';
import { FormsModule } from '@angular/forms';
import { empty } from '../../shared/models/editor/entity';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let Adminservice: AdminService;
  let Reportservice: ReportService;
   
  let router: Router;
  // let route: ActivatedRoute;
  let httpTestingController: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [AdminService,ReportService],
      imports: [HttpClientTestingModule,RouterTestingModule,NgxPaginationModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    component.scripts = [];
    fixture.detectChanges();
    Adminservice = TestBed.inject(AdminService);
    Reportservice = TestBed.inject(ReportService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const Res1: myScript[] = [{
    name: "",
    author: {name:"",email:""},
    boardgame: "",
    description:"",
    version:{major:0,minor:0,patch:0},
    size: 0,
    icon: {name:"",location:"",key:""},
    build: {name:"",location:"",key:""},
    models: [],
    _id: "",
    created: new Date(0),
    lastUpdate: new Date(0),
    status:{value:0,message:""},
    export: false,
    programStructure:empty,
    source: { name: "", location: "", key: ""}
    }];
  const Res2: report[]=[{
    _id: "",
    user: {name:"",email:""},
    script: "",
    message:"",
    dateIssued: new Date(0)
    }];
  const Res3: automataScript[]=[{
    _id:"",
    dateReleased: new Date(0),
    downloads:0,
    lastDownload: new Date(0),
    export: false,
    comments: [],
    source: { name: "", key: "", location: ""},
    previous: [],
    name: "",
    author:{name:"",email:""},
    boardgame:"",
    description:"",
    version:{major:0,minor:0,patch:0},
    size: 0,
    icon: {name:"",location:"",key:""},
    build: {name:"",location:"",key:""},
    models: []
    }];

    it('should load all scripts when ngOnInit()', ()=>{
      jest.spyOn(Adminservice,'getScripts'); //Spy when it's called
      jest.spyOn(Adminservice,'getUserOwnedScripts'); //
      jest.spyOn(Reportservice,'getAll');

      expect(component.scripts).toStrictEqual([]);
      expect(component.inProgressScripts).toStrictEqual([]);
      expect(component.reports).toStrictEqual([]);

      component.ngOnInit();

      expect(Adminservice.getScripts).toBeCalledTimes(1);
      expect(Adminservice.getUserOwnedScripts).toBeCalledTimes(1);
      expect(Reportservice.getAll).toBeCalledTimes(1);

      expect(component.scripts).toBeTruthy();
      expect(component.inProgressScripts).toBeTruthy();
      expect(component.reports).toBeTruthy();

      fixture.detectChanges();

      const reqScripts = httpTestingController.expectOne('http://localhost:3333/api/automata-scripts/retreive-all');
      expect(reqScripts.request.method).toBe('GET');
      reqScripts.flush(Res1);

      fixture.detectChanges();


      const reqInProgr = httpTestingController.expectOne('http://localhost:3333/api/my-scripts/all-scripts');
      expect(reqInProgr.request.method).toBe('GET');
      reqInProgr.flush(Res2);

      
      const reqRep = httpTestingController.expectOne('http://localhost:3333/api/automata-scripts/retrive-by-id');
      expect(reqRep.request.method).toBe('GET');
      reqRep.flush(Res3);
      // const Scripts = fixture.nativeElement.querySelectorAll('tr');
      // expect(Scripts.length-1).toEqual(Response.length); //minus first row

      // const navigateSpy = jest.spyOn(router,'navigate');

      // const btnEdit = fixture.nativeElement.querySelector('.btn-success');
      // btnEdit.click();
      
      // expect(navigateSpy).toBeCalled();
    });
});
