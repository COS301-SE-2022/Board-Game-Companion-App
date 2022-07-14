import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorComponent } from './editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [ScriptService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateDimensions should be called in ConsoleHeight', ()=>{
    component.updateConsoleHeight(200);
    expect(component.updateDimensions).toHaveBeenCalled;
  });

  it('updateDimensions should be called in toggleSideBar', ()=>{
    component.toggleSideBar();
    expect(component.updateDimensions).toHaveBeenCalled;
  });

});

