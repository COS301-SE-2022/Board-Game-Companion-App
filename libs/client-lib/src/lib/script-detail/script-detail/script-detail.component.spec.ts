import { CommentService } from '../../shared/services/comments/comment.service';
import { ScriptDetailComponent } from './script-detail.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientLibRoutingModule } from '../../client-lib-routing.module';
import { StorageService } from '../../shared/services/storage/storage.service';
import { ModelsService } from '../../shared/services/models/models.service';
import { OnlineStatusService } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { ReportService } from '../../shared/services/reports/report.service';
import 'fake-indexeddb/auto';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

describe('ScriptDetailComponent', () => {
  let component: ScriptDetailComponent;
  // let fixture: ComponentFixture<CommentSectionComponent>;
  let commentService: CommentService;
  let scriptService: ScriptService;
  let searchService: BggSearchService;
  let router: Router;
  let route: ActivatedRoute;
  let gapi:  GoogleAuthService;
  let reportService: ReportService;
  let networkService: OnlineStatusService;
  let storageService: StorageService;
  let modelsService: ModelsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptDetailComponent],
      providers: [CommentService,ScriptService,BggSearchService,StorageService,ModelsService,OnlineStatusService,
        ReportService,GoogleAuthService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientTestingModule,ClientLibRoutingModule,RouterTestingModule.withRoutes([])]
    }).compileComponents();
  });

  it('should create a component', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    searchService = TestBed.inject(BggSearchService);
    storageService = TestBed.inject(StorageService);
    modelsService = TestBed.inject(ModelsService);
    networkService = TestBed.inject(OnlineStatusService);
    gapi = TestBed.inject(GoogleAuthService);
    reportService = TestBed.inject( ReportService );
    component  = new ScriptDetailComponent(scriptService,searchService,commentService,
      router,route,gapi,reportService,networkService,storageService,modelsService);
    expect(component).toBeTruthy();
  });

  it('should create services', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    searchService = TestBed.inject(BggSearchService);
    expect(commentService).toBeTruthy();
    expect(scriptService).toBeTruthy();
    expect(searchService).toBeTruthy();
    // component  = new ScriptDetailComponent(scriptService,searchService,commentService,router,route);
  });
  it('should create initialized variables', () => {
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    searchService = TestBed.inject(BggSearchService);
    storageService = TestBed.inject(StorageService);
    modelsService = TestBed.inject(ModelsService);
    networkService = TestBed.inject(OnlineStatusService);
    gapi = TestBed.inject(GoogleAuthService);
    reportService = TestBed.inject( ReportService );
    component  = new ScriptDetailComponent(scriptService,searchService,commentService,router,route,gapi,reportService,networkService,storageService,modelsService);
    expect(component.voterCount).toEqual(0);
    expect(component.averageRating).toEqual(0);
    expect(component.months).toBeDefined();
    expect(component.months.length).toEqual(12);
  });

  it('functions should be defined',() =>{
    commentService = TestBed.inject(CommentService);
    scriptService = TestBed.inject(ScriptService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    searchService = TestBed.inject(BggSearchService);
    storageService = TestBed.inject(StorageService);
    modelsService = TestBed.inject(ModelsService);
    networkService = TestBed.inject(OnlineStatusService);
    gapi = TestBed.inject(GoogleAuthService);
    reportService = TestBed.inject( ReportService );
    component  = new ScriptDetailComponent(scriptService,searchService,commentService,router,route,gapi,reportService,networkService,storageService,modelsService);
    expect(component.getBoardGameName).toBeDefined();
    expect(component.toggleComments).toBeDefined();
    expect(component.getRating).toBeDefined();
    expect(component.getAverageRating).toBeDefined();
    expect(component.getVoterCount).toBeDefined();
    expect(component.rateScript).toBeDefined();
    expect(component.getAverageRating).toBeDefined();
    expect(component.formatDate).toBeDefined();
    expect(component.incrementCommentCounter).toBeDefined();
    expect(component.play).toBeDefined();
    expect(component.countComments).toBeDefined();
  });
});