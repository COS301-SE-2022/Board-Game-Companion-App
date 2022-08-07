import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../services/scripts/script.service';
import { InputInterfaceComponent } from './input-interface.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InputInterfaceComponent', () => {
  let component: InputInterfaceComponent;
  let fixture: ComponentFixture<InputInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputInterfaceComponent],
      imports: [HttpClientTestingModule],
      providers: [ScriptService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
