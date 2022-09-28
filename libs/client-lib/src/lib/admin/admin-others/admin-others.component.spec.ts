import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdminOthersComponent } from './admin-others.component';

describe('AdminOtherComponent', () => {
  let component: AdminOthersComponent;
  let fixture: ComponentFixture<AdminOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOthersComponent],
    imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });
  
});