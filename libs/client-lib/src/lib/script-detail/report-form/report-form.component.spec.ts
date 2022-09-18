import { ReportFormComponent } from './report-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OAuthLogger, OAuthService, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
describe('ReportFormComponent', () => {
  let component: ReportFormComponent;
  let fixture: ComponentFixture<ReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportFormComponent],
      providers: [CommentService,ReportService,OAuthLogger,OAuthService,
        GoogleAuthService,DateTimeProvider,UrlHelperService],
      imports: [HttpClientTestingModule,FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });
  
});
