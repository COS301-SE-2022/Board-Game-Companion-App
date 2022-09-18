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
describe('EditorToolBarComponent', () => {
  let component: EditorToolBarComponent;
  let fixture: ComponentFixture<EditorToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorToolBarComponent,EditorEditFeaturesComponent,EditorHelpComponent,VisualHelpComponent,EditorModelsComponent],
      imports: [RouterTestingModule,FormsModule,HttpClientTestingModule],
      providers: [ModelsService,StorageService,EditorService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
