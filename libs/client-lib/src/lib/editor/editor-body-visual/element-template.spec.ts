import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ElementTemplateComponent } from './element-template';

describe('EditorBodyVisualComponent', () => {
  let component: ElementTemplateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ElementTemplateComponent],
      providers: [DragulaService],
      imports: [DragulaModule,BrowserModule,CommonModule],
    }).compileComponents();

  });

  it('should create', () => {
    component = new ElementTemplateComponent();
    expect(component).toBeTruthy();
  });
});