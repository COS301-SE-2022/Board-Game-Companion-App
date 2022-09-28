import { AdminReportsComponent } from './admin-reports.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../shared/services/reports/report.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
describe('AdminReportsComponent', () => {
  let component: AdminReportsComponent;
  let fixture: ComponentFixture<AdminReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminReportsComponent,NotificationComponent],
      providers: [ReportService,ScriptService],
      imports: [HttpClientTestingModule,FormsModule,RouterTestingModule,NgxPaginationModule]
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
  
});