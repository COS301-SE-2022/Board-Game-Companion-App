import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { EditorEditFeaturesComponent } from '../editor-edit-features/editor-edit-features.component';
import { EditorHelpComponent } from '../editor-help/editor-help.component';
import { EditorModelsComponent } from '../editor-models/editor-models.component';
import { VisualHelpComponent } from '../visual-help/visual-help.component';
import { EditorToolBarComponent } from './editor-tool-bar.component';
import 'fake-indexeddb/auto';
import { EditorService } from '../../shared/services/editor/editor.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { EditorThemeComponent } from '../editor-theme/editor-theme.component';
import * as ace from 'ace-builds/src-noconflict/ace';
ace.config.set('basePath', '/assets/ui/');
ace.config.set('modePath', '');
ace.config.set('themePath', '');
import 'brace/mode/json';
import { Router } from '@angular/router';
describe('EditorToolBarComponent', () => {
  let component: EditorToolBarComponent;
  // let fixture: ComponentFixture<EditorToolBarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorToolBarComponent,EditorEditFeaturesComponent,EditorThemeComponent,
        EditorHelpComponent,VisualHelpComponent,EditorModelsComponent,NotificationComponent],
      imports: [RouterTestingModule,FormsModule,HttpClientTestingModule],
      providers: [ModelsService,StorageService,EditorService]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(EditorToolBarComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   jest.spyOn(console, 'warn').mockImplementation(()=>{console.log('pass..')});
  // });

  afterEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(()=>{console.log('pass..')});
  });
  it('should create', () => {
    component = new EditorToolBarComponent(router);
    expect(component).toBeTruthy();
  });
});
