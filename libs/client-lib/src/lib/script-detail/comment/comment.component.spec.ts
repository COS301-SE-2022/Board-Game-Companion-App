import { CommentService } from '../../shared/services/comments/comment.service';
import { CommentComponent } from './comment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OnlineStatusService } from 'ngx-online-status';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
// import { comment,empty } from '../../shared/models/comment';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let commentService: CommentService;
  let gapiService: GoogleAuthService;
  let networkService : OnlineStatusService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentComponent,NotificationComponent],
      providers: [CommentService,GoogleAuthService,OnlineStatusService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    commentService = TestBed.inject(CommentService);
    gapiService = TestBed.inject(GoogleAuthService);
    networkService = TestBed.inject(OnlineStatusService);
  });

  it('should create', () => {
    component  = new CommentComponent(commentService,networkService,gapiService);
    expect(component).toBeTruthy();
  });

  it('should verify initial variables', () => {
    component  = new CommentComponent(commentService,networkService,gapiService);
    expect(component.depth).toEqual(0);
    expect(component.width).toEqual(0);
    expect(component.script).toBe("");
  });
});