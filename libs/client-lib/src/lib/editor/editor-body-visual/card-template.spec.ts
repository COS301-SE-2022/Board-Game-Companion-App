import { CommonModule } from '@angular/common';
import { /*ComponentFixture,*/ TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { CardTemplateComponent } from './card-template';

describe('EditorBodyVisualComponent', () => {
  let component: CardTemplateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [CardTemplateComponent],
      providers: [DragulaService],
      imports: [DragulaModule,BrowserModule,CommonModule],
    }).compileComponents();

  });

  it('should create', () => {
    component = new CardTemplateComponent();
    expect(component).toBeTruthy();
  });
});