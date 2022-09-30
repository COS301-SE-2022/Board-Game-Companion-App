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
//   export interface inputParameters{
//     prompt: string;
//     type: string;
//     options?: string[];
// }
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create inputParameters',()=>{
    component.parameters.push({prompt: 'Fav Color',type: 'text'});
    component.parameters.push({prompt: 'Online ?',type: 'boolean'});

    component.ngOnChanges();
    component.onEnter({key:'Enter',preventDefault:jest.fn()});
    expect(component.sequence(2)).toStrictEqual([0,1]);
    expect(component.result.length).toBe(2);
  });


});
