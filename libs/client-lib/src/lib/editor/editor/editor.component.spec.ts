import { TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorComponent } from './editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let router: Router;
  let service: ScriptService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [ScriptService]
    }).compileComponents();
    service = TestBed.inject(ScriptService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    component = new EditorComponent(service,router);
    expect(component).toBeTruthy();
  });

  it('updateDimensions should be called in ConsoleHeight', ()=>{
    component.updateConsoleHeight(200);
    expect(component.updateDimensions).toHaveBeenCalled;
  });

  it('updateDimensions', ()=>{
    expect(component.updateDimensions).toBeDefined();
  });

});

