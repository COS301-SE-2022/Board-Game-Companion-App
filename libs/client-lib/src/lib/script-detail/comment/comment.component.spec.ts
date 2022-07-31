import { CommentService } from '../../shared/services/comments/comment.service';
import { CommentComponent } from './comment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
// import { comment,empty } from '../../shared/models/comment';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let service: CommentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentComponent],
      providers: [CommentService],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(CommentService);
  });

  it('should create', () => {
    component  = new CommentComponent(service);
    expect(component).toBeTruthy();
  });

  it('should verify initial variables', () => {
    component  = new CommentComponent(service);
    expect(component.depth).toEqual(0);
    expect(component.width).toEqual(0);
    expect(component.script).toBe("");
  });
});