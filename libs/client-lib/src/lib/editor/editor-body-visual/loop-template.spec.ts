import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { LoopTemplateComponent } from './loop-template';

describe('EditorBodyVisualComponent', () => {
  let component: LoopTemplateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoopTemplateComponent],
      providers: [DragulaService],
      imports: [DragulaModule,BrowserModule,CommonModule],
    }).compileComponents();

  });

  it('should create', () => {
    component = new LoopTemplateComponent();
    expect(component).toBeTruthy();
  });
});