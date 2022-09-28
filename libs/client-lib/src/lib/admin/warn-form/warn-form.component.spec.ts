import { WarnFormComponent } from './warn-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { AdminService } from '../../shared/services/admin/admin.service';
import { SocketIoModule } from 'ngx-socket-io';
describe('ReportFormComponent', () => {
  let component: WarnFormComponent;
  let fixture: ComponentFixture<WarnFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarnFormComponent,NotificationComponent],
      providers: [AdminService],
      imports: [HttpClientTestingModule,FormsModule,SocketIoModule.forRoot({ url: 'https://board-game-companion-app.herokuapp.com/api/', options: { transports: ['websocket'], reconnection: true } })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });
  
});
