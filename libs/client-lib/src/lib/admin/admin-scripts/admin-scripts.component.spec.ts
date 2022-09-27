import { AdminScriptsComponent } from './admin-scripts.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

describe('ReportFormComponent', () => {
  let component: AdminScriptsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NotificationComponent/*,BaseChartDirective*/],
      providers: [ScriptService],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });

  it('should create',() => {
    expect(component).toBeUndefined();
  });
  
});