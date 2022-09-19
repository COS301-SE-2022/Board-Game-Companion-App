import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { EditorBodyVisualComponent } from './editor-body-visual.component';
import { ElementTemplateComponent } from './element-template';
import { PlayerTemplateComponent } from './player-template';

describe('EditorBodyVisualComponent', () => {
  let component: EditorBodyVisualComponent;
  let fixture: ComponentFixture<EditorBodyVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorBodyVisualComponent,ElementTemplateComponent,PlayerTemplateComponent],
      providers: [DragulaService],
      imports: [DragulaModule,BrowserModule,CommonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  });

  it('should create', () => {
    component = new EditorBodyVisualComponent();
    expect(component).toBeTruthy();
  });
});
