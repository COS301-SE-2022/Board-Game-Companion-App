import { WarnFormComponent } from './warn-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { AdminService } from '../../shared/services/admin/admin.service';
import { SocketIoModule } from 'ngx-socket-io';
import { By } from '@angular/platform-browser';

/*********************************************** Integration Testing ****************************************************************/
describe('ReportFormComponent', () => {
  let component: WarnFormComponent;
  let fixture: ComponentFixture<WarnFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarnFormComponent,NotificationComponent],
      providers: [AdminService],
      imports: [HttpClientModule,FormsModule,SocketIoModule.forRoot({ url: 'https://board-game-companion-app.herokuapp.com', options: { transports: ['websocket'], reconnection: true } })]
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
  describe('Send a warning',()=>{
    it('should send a warning by Enter',async()=>{
      fixture.whenStable().then(()=> {
        const textarea = fixture.debugElement.query(By.css('textarea'));
        component.account = {name:'Njabulo Ntuli',email:'u19062665@tuks.co.za'};
        const element = textarea.nativeElement;
        
        expect(element.value).toBe("");
        element.value = 'This is a last warning User 31314';

        // fireEvent.keyPress(textarea, { key: 'Enter', charCode: 13});
        element.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter'}));
        fixture.detectChanges();
        expect(component.content).toBe('This is a last warning User 31314');
      });
    });

    it('should clear the content',()=>{
      component.content = 'To test';
      expect(component.content).toBe('To test');
      component.clear();
      expect(component.content).toBe('');
    });
  });
});
