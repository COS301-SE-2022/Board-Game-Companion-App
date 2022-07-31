import { CommentService } from '../../shared/services/comments/comment.service';
import { CommentFormComponent } from './comment-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { comment,empty } from '../../shared/models/comment';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let service: CommentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentFormComponent],
      providers: [CommentService],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(CommentService);
  });

  it('should create a component', () => {
    component  = new CommentFormComponent(service);
    expect(component).toBeTruthy();
  });

  it('should create a service', () => {
    // component  = new CommentFormComponent(service);
    expect(service).toBeTruthy();
  });
  it('should create initialized variables', () => {
    component  = new CommentFormComponent(service);
    expect(component.formType).toBe("");
    expect(component.width).toEqual(0);
    expect(component.script).toBe("");
  });

  it('functions should be defined',() =>{
    component  = new CommentFormComponent(service);
    expect(component.clear).toBeDefined();
    expect(component.recordComment).toBeDefined();
  });

});
