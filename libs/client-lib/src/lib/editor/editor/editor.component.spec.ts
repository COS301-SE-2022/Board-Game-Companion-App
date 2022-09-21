import { TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage/storage.service';
import { DragulaService } from 'ng2-dragula';
import { ModelsService } from '../../shared/services/models/models.service';
import { EditorService } from '../../shared/services/editor/editor.service';
import 'fake-indexeddb/auto';

let mockStorage: any = {};

describe('EditorComponent', () => {
  let component: EditorComponent;
  let router: Router;
  let editorService: EditorService;
  let storageService: StorageService;
  let dragularService: DragulaService;
  let modelsService: ModelsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [EditorService,StorageService,DragulaService,ModelsService]
    }).compileComponents();
    editorService = TestBed.inject(EditorService);
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    dragularService = TestBed.inject(DragulaService);
    modelsService = TestBed.inject(ModelsService);

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
    component = new EditorComponent(editorService,router,dragularService,storageService,modelsService);
    expect(component).toBeTruthy();
  });

  it('updateDimensions should be called in ConsoleHeight', ()=>{
    component.updateConsoleHeight(200);
    expect(component.updateDimensions).toHaveBeenCalled;
  });

  // it('should change theme of editor', ()=>{
  //   mockStorage ={'board-game-companion-script-editor-theme': JSON.stringify('dark')};
  //   component.changeTheme();
  // });

  // it('should execute a script', ()=>{
 
  // });
  
});

