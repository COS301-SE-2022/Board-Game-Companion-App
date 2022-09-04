import { ReportFormComponent } from './comment-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ReportFormComponent', () => {
  let component: ReportFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportFormComponent],
      providers: [CommentService],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });



});
