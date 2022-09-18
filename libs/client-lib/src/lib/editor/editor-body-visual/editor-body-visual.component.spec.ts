import { CommonModule } from '@angular/common';
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
      imports: [DragulaModule,BrowserModule,CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorBodyVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
