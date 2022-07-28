import { TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorComponent } from './editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

let mockStorage: any = {};

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

    const mockLocalStorage = {
      getItem: (key: string): string => {
      return key in mockStorage ? mockStorage[key] : null },

      setItem: (key: string, value: string) => {
        mockStorage[key] = `${value}`;},

      removeItem: (key: string) => {
      delete mockStorage[key];},

      clear: () => {
        mockStorage = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })
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
    component.ngOnInit();
    expect(component.updateDimensions).toBeDefined();
    component.onScreenResize();
  });

  // it('should change theme of editor', ()=>{
  //   mockStorage ={'board-game-companion-script-editor-theme': JSON.stringify('dark')};
  //   component.changeTheme();
  // });

  // it('should execute a script', ()=>{
 
  // });
  
});

