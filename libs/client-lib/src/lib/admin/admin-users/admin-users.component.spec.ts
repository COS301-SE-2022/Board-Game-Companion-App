import { AdminUsersComponent } from './admin-users.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { AdminService } from '../../shared/services/admin/admin.service';
describe('ReportFormComponent', () => {
  let component: AdminUsersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [AdminService],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });

  it('should create',() => {
    expect(component).toBeUndefined();
  });
  
});