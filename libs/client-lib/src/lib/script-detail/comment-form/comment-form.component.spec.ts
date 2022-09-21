import { CommentService } from '../../shared/services/comments/comment.service';
import { CommentFormComponent } from './comment-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { OnlineStatusService } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
// import { comment,empty } from '../../shared/models/comment';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let commentService: CommentService;
  let gapi: GoogleAuthService;
  let networkService: OnlineStatusService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentFormComponent,NotificationComponent],
      providers: [CommentService,GoogleAuthService,OnlineStatusService,
        OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    commentService = TestBed.inject(CommentService);
    gapi = TestBed.inject(GoogleAuthService);
    networkService = TestBed.inject(OnlineStatusService);
  });

  it('should create a component', () => {
    component  = new CommentFormComponent(commentService, gapi, networkService);
    expect(component).toBeTruthy();
  });

  it('should create a service', () => {
    // component  = new CommentFormComponent(service);
    expect(commentService).toBeTruthy();
    expect(gapi).toBeTruthy();
    expect(networkService).toBeTruthy();
  });
  it('should create initialized variables', () => {
    component  = new CommentFormComponent(commentService, gapi, networkService);
    expect(component.formType).toBe("");
    expect(component.width).toEqual(0);
    expect(component.script).toBe("");
  });

  it('functions should be defined',() =>{
    component  = new CommentFormComponent(commentService, gapi, networkService);
    expect(component.clear).toBeDefined();
    expect(component.recordComment).toBeDefined();
  });

});
