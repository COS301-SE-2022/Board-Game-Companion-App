import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

import { ScriptDetailComponent } from './script-detail.component';

describe('ScriptDetailComponent', () => {
  let component: ScriptDetailComponent;
  let fixture: ComponentFixture<ScriptDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptDetailComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [ScriptService,BggSearchService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
