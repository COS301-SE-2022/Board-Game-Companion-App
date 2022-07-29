import { CommentService } from '../../shared/services/comments/comment.service';
import { CommentSectionComponent } from './comment-section.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';

describe('CommentSectionComponent', () => {
  let component: CommentSectionComponent;
  // let fixture: ComponentFixture<CommentSectionComponent>;
  let commentService: CommentService;
  let scriptService: ScriptService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentSectionComponent],
      providers: [CommentService,ScriptService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create a component', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    component  = new CommentSectionComponent(commentService,scriptService);
    expect(component).toBeTruthy();
  });

  it('should create services', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    component  = new CommentSectionComponent(commentService,scriptService);
    expect(commentService).toBeTruthy();
    expect(scriptService).toBeTruthy();
  });
  it('should create initialized variables', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    component  = new CommentSectionComponent(commentService,scriptService);
    expect(component.showComments).toBe(false);
    expect(component.comments).toEqual([]);
  });

  it('functions should be defined',() =>{
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    component  = new CommentSectionComponent(commentService,scriptService);
    expect(component.ngOnChanges).toBeDefined();
    expect(component.addNewComment).toBeDefined();
  });

});