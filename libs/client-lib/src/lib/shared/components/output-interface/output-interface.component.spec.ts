import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../services/scripts/script.service';
import { OutputInterfaceComponent } from './output-interface.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InputInterfaceComponent', () => {
  let component: OutputInterfaceComponent;
  let fixture: ComponentFixture<OutputInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputInterfaceComponent],
      imports: [HttpClientTestingModule],
      providers: [ScriptService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
