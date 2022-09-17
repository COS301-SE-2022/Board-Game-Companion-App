import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { EditorModelsComponent } from './editor-models.component';
import 'fake-indexeddb/auto';
import { EditorService } from '../../shared/services/editor/editor.service';

describe('EditorModelsComponent', () => {
  let component: EditorModelsComponent;
  let fixture: ComponentFixture<EditorModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorModelsComponent],
      providers: [ModelsService,StorageService,EditorService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
