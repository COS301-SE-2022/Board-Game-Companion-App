import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorTextSideBarComponent } from './editor-text-side-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageService } from '../../shared/services/storage/storage.service';
import 'fake-indexeddb/auto';
import { ModelsService } from '../../shared/services/models/models.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { empty } from '../../shared/models/editor/entity';

let mockStorage: any = {};

describe('EditorTextSideBarComponent', () => {
  let component: EditorTextSideBarComponent;
  let fixture: ComponentFixture<EditorTextSideBarComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorTextSideBarComponent],
      imports: [HttpClientTestingModule,RouterTestingModule,NgxPaginationModule],
      providers: [StorageService,ModelsService]
    }).compileComponents();

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

  jest.mock('./editor-text-side-bar.component');
  EditorTextSideBarComponent.prototype.ngOnInit = function(){
    if(this.current._id!=='')
      this.getModels();
  }
  EditorTextSideBarComponent.prototype.current = { _id:'',
  created: new Date(0),
  lastUpdate:new Date(0),
  status:{value:0,message:''},
  export: false,
  programStructure:empty,
  source:{ name: '', location: '', key: ''},
  name: '',
  author:{name:'',email:''},
  boardgame:'',
  description:'',
  version:{major:0,minor:0,patch:0},
  size:0,
  icon:{name:'',location:'',key:''},
  build:{name:'',location:'',key:''},
  models:[],

}

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTextSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
   
    expect(component).toBeTruthy();
  });

});

