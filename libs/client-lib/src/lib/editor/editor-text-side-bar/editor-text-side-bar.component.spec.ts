import { TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorTextSideBarComponent } from './editor-text-side-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

let mockStorage: any = {};

describe('EditorTextSideBarComponent', () => {
  let component: EditorTextSideBarComponent;
  let router: Router;
  let service: ScriptService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorTextSideBarComponent],
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
  
});

