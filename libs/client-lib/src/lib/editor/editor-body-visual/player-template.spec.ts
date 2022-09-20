import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { PlayerTemplateComponent } from './player-template';

describe('EditorBodyVisualComponent', () => {
  let component: PlayerTemplateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PlayerTemplateComponent],
      providers: [DragulaService],
      imports: [DragulaModule,BrowserModule,CommonModule],
    }).compileComponents();

  });

  it('should create', () => {
    component = new PlayerTemplateComponent();
    expect(component).toBeTruthy();
  });
});