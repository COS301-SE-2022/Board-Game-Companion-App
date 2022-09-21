import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { EditorTextSideBarComponent } from '../editor-text-side-bar/editor-text-side-bar.component';
import { EditorSideBarComponent } from './editor-side-bar.component';
import 'fake-indexeddb/auto';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { empty } from '../../shared/models/editor/entity';
import { of } from 'rxjs';
describe('EditorSideBarComponent', () => {
  let component: EditorSideBarComponent;
  let fixture: ComponentFixture<EditorSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorSideBarComponent,EditorTextSideBarComponent,NotificationComponent],
      imports: [HttpClientTestingModule],
      providers: [ModelsService,StorageService]
    }).compileComponents();
  });

  jest.mock('../editor-text-side-bar/editor-text-side-bar.component');
  EditorTextSideBarComponent.prototype.current = { 
    _id:'',
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
  EditorTextSideBarComponent.prototype.ngOnInit = function(){
    if(EditorTextSideBarComponent.prototype.current._id==='')
      EditorTextSideBarComponent.prototype.getModels();
  }
  EditorTextSideBarComponent.prototype.getModels = function(){
    return of(empty);

  }

  // beforeEach(() => {

  //   fixture = TestBed.createComponent(EditorSideBarComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    component = new EditorSideBarComponent();
    expect(component).toBeTruthy();
  });
});
