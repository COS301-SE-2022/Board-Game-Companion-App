import { AdminReportsComponent } from './admin-reports.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../shared/services/reports/report.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { report } from '../../shared/models/scripts/report';

/**************************************** Integration Tests ******************************************/
describe('AdminReportsComponent', () => {
  let component: AdminReportsComponent;
  let fixture: ComponentFixture<AdminReportsComponent>;
  let arraySize: number;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminReportsComponent,NotificationComponent],
      providers: [ReportService,ScriptService],
      imports: [HttpClientModule,FormsModule,RouterTestingModule,NgxPaginationModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function',()=>{
    it('should load scriptsReports and commentReports',(done)=>{
      component.ngOnInit();
      setTimeout(()=>{
      expect(component.commentReports.length).toBeGreaterThanOrEqual(0);
      expect(component.scriptReports.length).toBeGreaterThanOrEqual(0);
      arraySize = component.scriptReports.length;
      done();
      },10000);
    });


    it('should return an array',()=>{
      expect((component.enumerate(5)).length).toBe(5);
    });
  });
  describe('ignore function should',()=>{
    const FLAG:report={
      _id: '6331c1bb776de18fc48908r',   
        user: {name:'Matome Makgopa',email:'u18166793@tuks.co.za'},
        script: false,
        link: "",
        message: "The script is running at all",
        dateIssued: new Date(),
    };
    it('should ignore a report',(done)=>{
      setTimeout(()=>{
        expect(component.scriptReports.length).toBe(arraySize);
        done();
      },5000);
    });
  });
});