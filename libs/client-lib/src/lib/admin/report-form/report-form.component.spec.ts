import { ReportFormComponent } from './report-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { AdminService } from '../../shared/services/admin/admin.service';
import { SocketIoModule } from 'ngx-socket-io';
import { By } from '@angular/platform-browser';

/*********************************************** Integration Testing ****************************************************************/
describe('ReportFormComponent', () => {
  let component: ReportFormComponent;
  let fixture: ComponentFixture<ReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportFormComponent,NotificationComponent],
      providers: [AdminService],
      imports: [HttpClientModule,FormsModule,SocketIoModule.forRoot({ url: 'https://board-game-companion-app.herokuapp.com', options: { transports: ['websocket'], reconnection: true } })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });

});
