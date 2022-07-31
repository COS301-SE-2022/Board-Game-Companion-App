import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';

import { ViewCollectionComponent } from './view-collection.component';

describe('ViewCollectionComponent', () => {
  let component: ViewCollectionComponent;
  let fixture: ComponentFixture<ViewCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCollectionComponent],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule],
      providers: [BggSearchService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
